/**
 * Local Gemini test — runs the same dedup + categorise pipeline on a folder
 * of photos on your laptop. No OneDrive needed.
 *
 * Usage:
 *   npx tsx scripts/test-gemini.ts ./path/to/photos
 *
 * Reads GEMINI_API_KEY from .env.local.
 *
 * Prints:
 *   - how many photos were grouped as duplicates
 *   - how many representatives were sent to Gemini
 *   - the full JSON response (so you can judge categorisation quality)
 *   - timing
 */
import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { config as loadDotenv } from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_FLASH } from "../lib/constants";
import { categorisePrompt } from "../lib/gemini/prompts";
import { parseAndValidate, validateCheckinData } from "../lib/gemini/validate";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic"]);

async function main() {
  loadDotenv({ path: ".env.local" });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY missing from .env.local");
    process.exit(1);
  }

  const folder = resolve(process.argv[2] ?? "");
  if (!process.argv[2]) {
    console.error("Usage: npx tsx scripts/test-gemini.ts <folder-of-photos>");
    process.exit(1);
  }

  const entries = (await readdir(folder)).filter((f) =>
    ALLOWED_EXT.has(extname(f).toLowerCase())
  );
  if (entries.length === 0) {
    console.error(`No photos found in ${folder} (jpg/png/webp/heic)`);
    process.exit(1);
  }

  console.log(`📁 Folder:   ${folder}`);
  console.log(`📷 Photos:   ${entries.length}\n`);

  const buffers = await Promise.all(
    entries.map(async (name) => ({
      name,
      bytes: await readFile(join(folder, name)),
    }))
  );

  const imageParts = buffers.map((p) => ({
    inlineData: {
      mimeType: p.name.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
      data: p.bytes.toString("base64"),
    },
  }));

  const isoDate = new Date().toISOString();
  const prompt = categorisePrompt({
    propertySlug: "test-property",
    tenancySlug: "test-tenancy",
    kind: "checkin",
    isoDate,
    filenames: buffers.map((p) => p.name),
  });

  console.log(`🤖 Calling ${GEMINI_FLASH} with all ${buffers.length} photo${buffers.length === 1 ? "" : "s"} (Gemini handles dedup)…`);
  const t2 = Date.now();
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: GEMINI_FLASH,
    contents: [{ role: "user", parts: [...imageParts, { text: prompt }] }],
    config: { responseMimeType: "application/json", temperature: 0.2 },
  });
  const t3 = Date.now();
  console.log(`   ${(t3 - t2) / 1000}s\n`);

  const text = response.text ?? "";
  console.log("📦 Raw response length:", text.length, "chars");

  let parsed;
  try {
    parsed = parseAndValidate(text, validateCheckinData);
  } catch (err) {
    console.error("\n❌ Validation FAILED:", err instanceof Error ? err.message : err);
    console.log("\n--- Raw output ---");
    console.log(text);
    process.exit(1);
  }

  console.log("✅ Valid JSON. Summary:");
  let totalItems = 0;
  let flagged = 0;
  let grouped = 0;
  for (const room of parsed.rooms) {
    totalItems += room.items.length;
    flagged += room.items.filter((i) => i.flagged).length;
    for (const item of room.items) {
      if (item.photoRefs.length > 1) grouped += item.photoRefs.length - 1;
    }
    console.log(`   • ${room.room} (${room.confidence}): ${room.items.length} item${room.items.length === 1 ? "" : "s"}`);
  }
  console.log(`   ─ Total: ${parsed.rooms.length} rooms, ${totalItems} items, ${flagged} flagged, ${grouped} photo${grouped === 1 ? "" : "s"} grouped under items\n`);

  console.log("--- Full JSON ---");
  console.log(JSON.stringify(parsed, null, 2));
}

main().catch((err) => {
  console.error("\n❌ Script failed:", err);
  process.exit(1);
});
