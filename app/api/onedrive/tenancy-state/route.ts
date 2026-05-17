import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { deriveTenancyState } from "@/lib/onedrive/stateDerivation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const propertySlug = req.nextUrl.searchParams.get("property");
    const tenancySlug = req.nextUrl.searchParams.get("tenancy");
    if (!propertySlug || !tenancySlug) {
      return NextResponse.json({ error: "property and tenancy query params required" }, { status: 400 });
    }
    const client = createGraphClient(token);
    const state = await deriveTenancyState(client, propertySlug, tenancySlug);
    return NextResponse.json(state);
  } catch (err) {
    return errorResponse(err);
  }
}
