import { GEMINI_FLASH } from "@/lib/constants";
import type { CheckinData, InspectionKind } from "@/types/domain";
import { getGeminiClient } from "./client";
import { categorisePrompt } from "./prompts";
import { parseAndValidate, validateCheckinData, ValidationError } from "./validate";

export interface PhotoInput {
  filename: string;
  downloadUrl: string;
}

interface FetchedPhoto extends PhotoInput {
  bytes: Buffer;
  mimeType: string;
}

async function fetchPhoto(photo: PhotoInput): Promise<FetchedPhoto> {
  const res = await fetch(photo.downloadUrl);
  if (!res.ok) throw new Error(`Failed to fetch photo ${photo.filename}: ${res.status}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  const mimeType = res.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
  return { ...photo, bytes, mimeType };
}

export interface CategorisationResult {
  data: CheckinData;
  stats: {
    uploaded: number;
    itemsDetected: number;
    photosGroupedByGemini: number;
  };
}

export async function runCategorisation(opts: {
  photos: PhotoInput[];
  propertySlug: string;
  tenancySlug: string;
  kind: InspectionKind;
}): Promise<CategorisationResult> {
  if (opts.photos.length === 0) {
    throw new Error("No photos to categorise");
  }

  // Download all photos in parallel and send all to Gemini.
  // Gemini handles deduplication semantically by grouping multiple photos of the
  // same item under one item's photoRefs[] (see prompt). This catches both burst-
  // mode duplicates and "same item from different angles" — which a pixel-based
  // hash cannot reliably distinguish from genuinely different items.
  const fetched = await Promise.all(opts.photos.map(fetchPhoto));

  const client = getGeminiClient();
  const isoDate = new Date().toISOString();
  const imageParts = fetched.map((p) => ({
    inlineData: { mimeType: p.mimeType, data: p.bytes.toString("base64") },
  }));
  const prompt = categorisePrompt({
    propertySlug: opts.propertySlug,
    tenancySlug: opts.tenancySlug,
    kind: opts.kind,
    isoDate,
    filenames: fetched.map((p) => p.filename),
  });

  const callGemini = async (extraInstruction = "") => {
    const response = await client.models.generateContent({
      model: GEMINI_FLASH,
      contents: [
        {
          role: "user",
          parts: [...imageParts, { text: prompt + extraInstruction }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });
    const text = response.text;
    if (!text) throw new ValidationError("Gemini returned an empty response");
    return parseAndValidate(text, validateCheckinData);
  };

  let parsed: CheckinData;
  try {
    parsed = await callGemini();
  } catch (err) {
    if (!(err instanceof ValidationError)) throw err;
    parsed = await callGemini(
      "\n\nIMPORTANT: your previous response was invalid. Return ONLY the JSON object exactly matching the schema above. No markdown, no commentary."
    );
  }
  parsed.propertySlug = opts.propertySlug;
  parsed.tenancySlug = opts.tenancySlug;
  parsed.kind = opts.kind;
  parsed.generatedAt = isoDate;

  let itemsDetected = 0;
  let photosGroupedByGemini = 0;
  for (const room of parsed.rooms) {
    itemsDetected += room.items.length;
    for (const item of room.items) {
      if (item.photoRefs.length > 1) photosGroupedByGemini += item.photoRefs.length - 1;
    }
  }

  return {
    data: parsed,
    stats: {
      uploaded: opts.photos.length,
      itemsDetected,
      photosGroupedByGemini,
    },
  };
}
