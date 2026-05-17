import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { tryListChildren } from "@/lib/onedrive/folders";
import { buildPhotosPath } from "@/lib/onedrive/paths";
import { runCategorisation } from "@/lib/gemini/categorise";
import { enforceUsage } from "@/lib/usage/track";
import { MAX_CATEGORISATIONS_PER_TENANCY } from "@/lib/constants";
import type { InspectionKind } from "@/types/domain";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

interface Body {
  propertySlug: string;
  tenancySlug: string;
  kind: InspectionKind;
}

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const { propertySlug, tenancySlug, kind } = (await req.json()) as Body;
    if (!propertySlug || !tenancySlug || !kind) {
      return NextResponse.json({ error: "propertySlug, tenancySlug, kind required" }, { status: 400 });
    }
    const client = createGraphClient(token);
    const photosPath = buildPhotosPath(propertySlug, tenancySlug, kind);
    const items = await tryListChildren(client, photosPath);
    const photos = items
      .filter((i) => i.file && i["@microsoft.graph.downloadUrl"])
      .map((i) => ({ filename: i.name, downloadUrl: i["@microsoft.graph.downloadUrl"] as string }));
    if (photos.length === 0) {
      return NextResponse.json({ error: "No photos found in folder" }, { status: 400 });
    }

    await enforceUsage({
      client,
      propertySlug,
      tenancySlug,
      action: "categorise",
      limit: MAX_CATEGORISATIONS_PER_TENANCY,
      cooldownSeconds: 30,
    });

    const result = await runCategorisation({ photos, propertySlug, tenancySlug, kind });
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
