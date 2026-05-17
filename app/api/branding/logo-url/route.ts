import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { getItem } from "@/lib/onedrive/folders";
import { buildLogoPath } from "@/lib/onedrive/paths";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const filename = req.nextUrl.searchParams.get("filename");
    if (!filename) {
      return NextResponse.json({ error: "filename query param required" }, { status: 400 });
    }
    const client = createGraphClient(token);
    const item = await getItem(client, buildLogoPath(filename));
    if (!item) {
      return NextResponse.json({ url: null });
    }
    return NextResponse.json({ url: item["@microsoft.graph.downloadUrl"] ?? null });
  } catch (err) {
    return errorResponse(err);
  }
}
