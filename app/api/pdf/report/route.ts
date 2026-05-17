import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { savePdf, saveJson } from "@/lib/onedrive/files";
import { buildDataJsonPath, buildPhotosPath, buildReportPdfPath } from "@/lib/onedrive/paths";
import { renderHtmlToPdf } from "@/lib/pdf/renderer";
import { renderReportHtml } from "@/lib/pdf/templates/report";
import { fetchPhotosAsDataUrls } from "@/lib/pdf/photos";
import { loadBranding } from "@/lib/branding/load";
import type { CheckinData } from "@/types/domain";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

interface Body {
  data: CheckinData;
  inspectorName?: string;
}

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const { data, inspectorName } = (await req.json()) as Body;
    if (!data?.propertySlug || !data?.tenancySlug || !data?.kind) {
      return NextResponse.json({ error: "Invalid data payload" }, { status: 400 });
    }
    const client = createGraphClient(token);
    const jsonPath = buildDataJsonPath(data.propertySlug, data.tenancySlug, data.kind);
    const pdfPath = buildReportPdfPath(data.propertySlug, data.tenancySlug, data.kind);
    const photosPath = buildPhotosPath(data.propertySlug, data.tenancySlug, data.kind);

    // Collect up to 4 unique photo refs per room (used in the per-room photo grid
    // at the top of each section). Deduplicated by filename so we never fetch
    // the same image twice.
    const wantedRefs = new Set<string>();
    for (const room of data.rooms) {
      const seenInRoom = new Set<string>();
      for (const item of room.items) {
        for (const ref of item.photoRefs) {
          if (seenInRoom.size >= 4) break;
          if (seenInRoom.has(ref)) continue;
          seenInRoom.add(ref);
          wantedRefs.add(ref);
        }
        if (seenInRoom.size >= 4) break;
      }
    }

    const [, photos, branding] = await Promise.all([
      saveJson(client, jsonPath, data),
      fetchPhotosAsDataUrls(client, photosPath, Array.from(wantedRefs)),
      loadBranding(client),
    ]);

    const html = renderReportHtml(data, photos, branding, inspectorName);
    const pdf = await renderHtmlToPdf(html);
    await savePdf(client, pdfPath, pdf);
    return NextResponse.json({ ok: true, jsonPath, pdfPath });
  } catch (err) {
    return errorResponse(err);
  }
}
