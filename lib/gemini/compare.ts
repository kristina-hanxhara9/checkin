import { GEMINI_PRO } from "@/lib/constants";
import type { CheckinData, ComparisonReport } from "@/types/domain";
import { getGeminiClient } from "./client";
import { comparisonPrompt } from "./prompts";
import { parseAndValidate, validateComparisonReport, ValidationError } from "./validate";

export async function runComparison(opts: {
  checkin: CheckinData;
  checkout: CheckinData;
  propertySlug: string;
  tenancySlug: string;
}): Promise<ComparisonReport> {
  const client = getGeminiClient();
  const isoDate = new Date().toISOString();
  const prompt = comparisonPrompt({
    propertySlug: opts.propertySlug,
    tenancySlug: opts.tenancySlug,
    checkin: opts.checkin,
    checkout: opts.checkout,
    isoDate,
  });

  const callGemini = async (extraInstruction = "") => {
    const response = await client.models.generateContent({
      model: GEMINI_PRO,
      contents: [{ role: "user", parts: [{ text: prompt + extraInstruction }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });
    const text = response.text;
    if (!text) throw new ValidationError("Gemini returned an empty response");
    return parseAndValidate(text, validateComparisonReport);
  };

  let parsed: ComparisonReport;
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
  parsed.generatedAt = isoDate;
  return parsed;
}
