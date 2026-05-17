import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { downloadJson, saveJson } from "@/lib/onedrive/files";
import { buildComparisonJsonPath, buildDataJsonPath } from "@/lib/onedrive/paths";
import { runComparison } from "@/lib/gemini/compare";
import { enforceUsage } from "@/lib/usage/track";
import { MAX_COMPARISONS_PER_TENANCY } from "@/lib/constants";
import type { CheckinData } from "@/types/domain";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

interface Body {
  propertySlug: string;
  tenancySlug: string;
}

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const { propertySlug, tenancySlug } = (await req.json()) as Body;
    if (!propertySlug || !tenancySlug) {
      return NextResponse.json({ error: "propertySlug and tenancySlug required" }, { status: 400 });
    }
    const client = createGraphClient(token);

    await enforceUsage({
      client,
      propertySlug,
      tenancySlug,
      action: "compare",
      limit: MAX_COMPARISONS_PER_TENANCY,
      cooldownSeconds: 30,
    });

    const [checkin, checkout] = await Promise.all([
      downloadJson<CheckinData>(client, buildDataJsonPath(propertySlug, tenancySlug, "checkin")),
      downloadJson<CheckinData>(client, buildDataJsonPath(propertySlug, tenancySlug, "checkout")),
    ]);
    if (!checkin?.rooms?.length || !checkout?.rooms?.length) {
      return NextResponse.json(
        { error: "Both check-in and check-out must be finalised before running comparison." },
        { status: 400 }
      );
    }
    const report = await runComparison({ checkin, checkout, propertySlug, tenancySlug });
    await saveJson(client, buildComparisonJsonPath(propertySlug, tenancySlug), report);
    return NextResponse.json(report);
  } catch (err) {
    return errorResponse(err);
  }
}
