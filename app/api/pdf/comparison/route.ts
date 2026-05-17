import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { downloadJson, savePdf } from "@/lib/onedrive/files";
import {
  buildComparisonPdfPath,
  buildDataJsonPath,
  buildPhotosPath,
} from "@/lib/onedrive/paths";
import { renderHtmlToPdf } from "@/lib/pdf/renderer";
import { renderComparisonHtml, type ComparisonPhotos } from "@/lib/pdf/templates/comparison";
import { fetchPhotosAsDataUrls } from "@/lib/pdf/photos";
import { loadBranding } from "@/lib/branding/load";
import type { CheckinData, ComparisonReport } from "@/types/domain";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 180;

const MAX_PHOTOS_PER_ROOM = 3;

interface Body {
  data: ComparisonReport;
  inspectorName?: string;
}

/** Build a map from roomName → array of up to N unique photoRefs across that room's items. */
function uniqueRefsPerRoom(source: CheckinData): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const room of source.rooms) {
    const seen = new Set<string>();
    const refs: string[] = [];
    for (const item of room.items) {
      for (const ref of item.photoRefs ?? []) {
        if (refs.length >= MAX_PHOTOS_PER_ROOM) break;
        if (seen.has(ref)) continue;
        seen.add(ref);
        refs.push(ref);
      }
      if (refs.length >= MAX_PHOTOS_PER_ROOM) break;
    }
    out[room.room] = refs;
  }
  return out;
}

function mapRefsToDataUrls(
  refsByRoom: Record<string, string[]>,
  dataUrlByFilename: Record<string, string>
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [room, refs] of Object.entries(refsByRoom)) {
    out[room] = refs.map((r) => dataUrlByFilename[r]).filter((u): u is string => Boolean(u));
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const { data, inspectorName } = (await req.json()) as Body;
    if (!data?.propertySlug || !data?.tenancySlug) {
      return NextResponse.json({ error: "Invalid data payload" }, { status: 400 });
    }
    const client = createGraphClient(token);
    const pdfPath = buildComparisonPdfPath(data.propertySlug, data.tenancySlug);

    // Load source check-in and check-out JSONs so we can pick room-level photo
    // representatives (one set for each side).
    const [checkinData, checkoutData] = await Promise.all([
      downloadJson<CheckinData>(client, buildDataJsonPath(data.propertySlug, data.tenancySlug, "checkin")),
      downloadJson<CheckinData>(client, buildDataJsonPath(data.propertySlug, data.tenancySlug, "checkout")),
    ]);

    const checkinRefs = uniqueRefsPerRoom(checkinData);
    const checkoutRefs = uniqueRefsPerRoom(checkoutData);
    const checkinAllRefs = Object.values(checkinRefs).flat();
    const checkoutAllRefs = Object.values(checkoutRefs).flat();

    const [checkinDataUrls, checkoutDataUrls, branding] = await Promise.all([
      fetchPhotosAsDataUrls(
        client,
        buildPhotosPath(data.propertySlug, data.tenancySlug, "checkin"),
        Array.from(new Set(checkinAllRefs)),
        { preferThumbnail: "medium" }
      ),
      fetchPhotosAsDataUrls(
        client,
        buildPhotosPath(data.propertySlug, data.tenancySlug, "checkout"),
        Array.from(new Set(checkoutAllRefs)),
        { preferThumbnail: "medium" }
      ),
      loadBranding(client),
    ]);

    const photoSet: ComparisonPhotos = {
      checkinByRoom: mapRefsToDataUrls(checkinRefs, checkinDataUrls),
      checkoutByRoom: mapRefsToDataUrls(checkoutRefs, checkoutDataUrls),
    };

    const html = renderComparisonHtml(data, photoSet, branding, inspectorName);
    const pdf = await renderHtmlToPdf(html);
    await savePdf(client, pdfPath, pdf);
    return NextResponse.json({ ok: true, pdfPath });
  } catch (err) {
    return errorResponse(err);
  }
}
