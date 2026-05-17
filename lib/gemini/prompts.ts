import type { InspectionKind } from "@/types/domain";

export function categorisePrompt(opts: {
  propertySlug: string;
  tenancySlug: string;
  kind: InspectionKind;
  isoDate: string;
  filenames: string[];
}): string {
  const phase = opts.kind === "checkin" ? "check_in" : "check_out";
  return `You are processing a bulk upload of UK rental property inspection photos.
Photos are unordered and unlabelled — you must determine the room from visual content.

Property: ${opts.propertySlug}
Tenancy: ${opts.tenancySlug}
Inspection: ${phase}
Date: ${opts.isoDate}

Photo filenames (in order of attached images):
${opts.filenames.map((f, i) => `  ${i + 1}. ${f}`).join("\n")}

Tasks:
1. Group photos by room. Infer room identity from visual cues (kitchen appliances, bathroom fixtures, bedroom furniture, living-room seating, hallway flooring, etc.).
2. **Deduplicate within each room.** Multiple photos may show the SAME item from different angles, zooms, or just be burst-mode duplicates. Treat all of those as ONE item — do NOT create separate item entries for them. List every such photo's filename in that item's "photoRefs" array.
3. For each *unique* item or surface in the room (Oven, Fridge, Walls, Floor, Sink, Mirror, Bed frame, Wardrobe, Carpet, etc.), produce one entry.
4. Rate each item: "Good", "Fair", or "Poor". When multiple photos show the same item, base the rating on the clearest/most-informative view.
5. Add a factual one-sentence note per item describing what you observe across all of its photos.
6. Set "flagged": true if the item shows damage, missing parts, unusual wear, or anything that may affect the deposit.
7. Populate "photoRefs" with EVERY filename showing that item, in order of importance (best representative photo first). The first filename will be used as the cover photo in PDF reports.
8. Set the room "confidence" based on how certain you are about the room identity.

Return ONLY valid JSON matching this shape:
{
  "propertySlug": "${opts.propertySlug}",
  "tenancySlug": "${opts.tenancySlug}",
  "kind": "${opts.kind}",
  "generatedAt": "${opts.isoDate}",
  "rooms": [
    {
      "room": "Kitchen",
      "confidence": "high",
      "items": [
        {
          "name": "Oven",
          "rating": "Good",
          "notes": "Clean interior, no visible damage.",
          "flagged": false,
          "photoRefs": ["photo-003.jpg"]
        }
      ]
    }
  ]
}`;
}

export function comparisonPrompt(opts: {
  propertySlug: string;
  tenancySlug: string;
  checkin: unknown;
  checkout: unknown;
  isoDate: string;
}): string {
  return `You are a professional inventory clerk producing a deposit comparison report for a UK private rental tenancy.
Apply UK Tenant Fees Act 2019 standards: only items that meaningfully worsened beyond normal use over the tenancy length are "tenant_liable".

Property: ${opts.propertySlug}
Tenancy: ${opts.tenancySlug}
Report date: ${opts.isoDate}

CHECK-IN data:
${JSON.stringify(opts.checkin, null, 2)}

CHECK-OUT data:
${JSON.stringify(opts.checkout, null, 2)}

For every item in every room:
- Compare check-in vs check-out condition.
- Classify the verdict as one of: "no_change" | "fair_wear" | "tenant_liable" | "pre_existing".
- "fair_wear" = normal use over time (light marks, normal cleaning needs, faded paint).
- "tenant_liable" = damage or cleanliness issues beyond normal use; explain why.
- "pre_existing" = the issue was already noted at check-in.
- For "tenant_liable" items only, give a realistic GBP cost estimate (otherwise estimatedCost = null).

Compute summary totals:
- totalFlagged: total items marked "tenant_liable" or "fair_wear" with a meaningful change.
- tenantLiableCount: total items marked "tenant_liable".
- depositRecommendation: one paragraph summary recommending what (if any) deductions are appropriate.

Return ONLY valid JSON matching this shape:
{
  "generatedAt": "${opts.isoDate}",
  "propertySlug": "${opts.propertySlug}",
  "tenancySlug": "${opts.tenancySlug}",
  "summary": {
    "totalFlagged": 0,
    "tenantLiableCount": 0,
    "depositRecommendation": "..."
  },
  "rooms": [
    {
      "room": "Kitchen",
      "items": [
        {
          "room": "Kitchen",
          "itemName": "Oven",
          "before": "Good — clean interior",
          "after": "Fair — light grease build-up",
          "verdict": "fair_wear",
          "reason": "Normal cooking residue over 12-month tenancy.",
          "estimatedCost": null
        }
      ]
    }
  ]
}`;
}
