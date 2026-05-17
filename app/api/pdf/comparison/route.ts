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
import {
  buildComparisonPhotoKey,
  renderComparisonHtml,
  type ComparisonPhotos,
} from "@/lib/pdf/templates/comparison";
import { fetchPhotosAsDataUrls } from "@/lib/pdf/photos";
import { loadBranding } from "@/lib/branding/load";
import type { CheckinData, ComparisonReport } from "@/types/domain";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 180;

interface Body {
  data: ComparisonReport;
  inspectorName?: string;
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

    // Load both source JSONs to find which photo represents each item.
    const [checkinData, checkoutData] = await Promise.all([
      downloadJson<CheckinData>(client, buildDataJsonPath(data.propertySlug, data.tenancySlug, "checkin")),
      downloadJson<CheckinData>(client, buildDataJsonPath(data.propertySlug, data.tenancySlug, "checkout")),
    ]);

    // For each ItemComparison, locate the first photoRef on both sides.
    const refs: ComparisonPhotos["refs"] = {};
    const checkinFirst = firstRefsByKey(checkinData);
    const checkoutFirst = firstRefsByKey(checkoutData);
    const checkinNeed = new Set<string>();
    const checkoutNeed = new Set<string>();
    for (const room of data.rooms) {
      for (const item of room.items) {
        const k = buildComparisonPhotoKey(room.room, item.itemName);
        const ci = checkinFirst.get(k);
        const co = checkoutFirst.get(k);
        if (ci || co) refs[k] = { checkin: ci, checkout: co };
        if (ci) checkinNeed.add(ci);
        if (co) checkoutNeed.add(co);
      }
    }

    const [checkinPhotos, checkoutPhotos, branding] = await Promise.all([
      fetchPhotosAsDataUrls(
        client,
        buildPhotosPath(data.propertySlug, data.tenancySlug, "checkin"),
        Array.from(checkinNeed),
        { preferThumbnail: "small" }
      ),
      fetchPhotosAsDataUrls(
        client,
        buildPhotosPath(data.propertySlug, data.tenancySlug, "checkout"),
        Array.from(checkoutNeed),
        { preferThumbnail: "small" }
      ),
      loadBranding(client),
    ]);

    const html = renderComparisonHtml(
      data,
      {
        checkin: checkinPhotos,
        checkout: checkoutPhotos,
        refs,
      },
      branding,
      inspectorName
    );
    const pdf = await renderHtmlToPdf(html);
    await savePdf(client, pdfPath, pdf);
    return NextResponse.json({ ok: true, pdfPath });
  } catch (err) {
    return errorResponse(err);
  }
}

function firstRefsByKey(data: CheckinData): Map<string, string> {
  const out = new Map<string, string>();
  for (const room of data.rooms) {
    for (const item of room.items) {
      if (item.photoRefs?.[0]) {
        out.set(buildComparisonPhotoKey(room.room, item.name), item.photoRefs[0]);
      }
    }
  }
  return out;
}
