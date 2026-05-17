import type { CheckinData, ComparisonReport, Rating, Verdict, Confidence } from "@/types/domain";

const RATINGS: Rating[] = ["Good", "Fair", "Poor"];
const VERDICTS: Verdict[] = ["no_change", "fair_wear", "tenant_liable", "pre_existing"];
const CONFIDENCES: Confidence[] = ["high", "medium", "low"];

export class ValidationError extends Error {}

function isString(x: unknown): x is string {
  return typeof x === "string";
}

export function validateCheckinData(input: unknown): CheckinData {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError("Response is not an object");
  }
  const obj = input as Record<string, unknown>;
  if (!Array.isArray(obj.rooms)) {
    throw new ValidationError("Missing 'rooms' array");
  }

  const cleaned: CheckinData = {
    propertySlug: isString(obj.propertySlug) ? obj.propertySlug : "",
    tenancySlug: isString(obj.tenancySlug) ? obj.tenancySlug : "",
    kind: obj.kind === "checkout" ? "checkout" : "checkin",
    generatedAt: isString(obj.generatedAt) ? obj.generatedAt : new Date().toISOString(),
    rooms: [],
  };

  for (const r of obj.rooms) {
    if (typeof r !== "object" || r === null) continue;
    const room = r as Record<string, unknown>;
    const roomName = isString(room.room) ? room.room : "Unknown room";
    const confidence: Confidence = CONFIDENCES.includes(room.confidence as Confidence)
      ? (room.confidence as Confidence)
      : "medium";
    const items: CheckinData["rooms"][number]["items"] = [];
    if (Array.isArray(room.items)) {
      for (const it of room.items) {
        if (typeof it !== "object" || it === null) continue;
        const item = it as Record<string, unknown>;
        items.push({
          name: isString(item.name) ? item.name : "Unnamed item",
          rating: RATINGS.includes(item.rating as Rating) ? (item.rating as Rating) : "Fair",
          notes: isString(item.notes) ? item.notes : "",
          flagged: item.flagged === true,
          photoRefs: Array.isArray(item.photoRefs) ? item.photoRefs.filter(isString) : [],
        });
      }
    }
    cleaned.rooms.push({ room: roomName, confidence, items });
  }

  if (cleaned.rooms.length === 0) {
    throw new ValidationError("AI returned zero rooms — try uploading more or different photos");
  }
  return cleaned;
}

export function validateComparisonReport(input: unknown): ComparisonReport {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError("Response is not an object");
  }
  const obj = input as Record<string, unknown>;

  const summarySrc = (obj.summary as Record<string, unknown> | undefined) ?? {};
  const summary = {
    totalFlagged: typeof summarySrc.totalFlagged === "number" ? summarySrc.totalFlagged : 0,
    tenantLiableCount: typeof summarySrc.tenantLiableCount === "number" ? summarySrc.tenantLiableCount : 0,
    depositRecommendation: isString(summarySrc.depositRecommendation) ? summarySrc.depositRecommendation : "",
  };

  const rooms: ComparisonReport["rooms"] = [];
  if (Array.isArray(obj.rooms)) {
    for (const r of obj.rooms) {
      if (typeof r !== "object" || r === null) continue;
      const room = r as Record<string, unknown>;
      const roomName = isString(room.room) ? room.room : "Unknown room";
      const items: ComparisonReport["rooms"][number]["items"] = [];
      if (Array.isArray(room.items)) {
        for (const it of room.items) {
          if (typeof it !== "object" || it === null) continue;
          const item = it as Record<string, unknown>;
          items.push({
            room: isString(item.room) ? item.room : roomName,
            itemName: isString(item.itemName) ? item.itemName : "Unnamed item",
            before: isString(item.before) ? item.before : "",
            after: isString(item.after) ? item.after : "",
            verdict: VERDICTS.includes(item.verdict as Verdict)
              ? (item.verdict as Verdict)
              : "no_change",
            reason: isString(item.reason) ? item.reason : "",
            estimatedCost: typeof item.estimatedCost === "number" ? item.estimatedCost : null,
          });
        }
      }
      rooms.push({ room: roomName, items });
    }
  }

  return {
    generatedAt: isString(obj.generatedAt) ? obj.generatedAt : new Date().toISOString(),
    propertySlug: isString(obj.propertySlug) ? obj.propertySlug : "",
    tenancySlug: isString(obj.tenancySlug) ? obj.tenancySlug : "",
    summary,
    rooms,
  };
}

export function parseAndValidate<T>(text: string, validator: (input: unknown) => T): T {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new ValidationError(
      `AI returned non-JSON response (${err instanceof Error ? err.message : "parse error"})`
    );
  }
  return validator(parsed);
}
