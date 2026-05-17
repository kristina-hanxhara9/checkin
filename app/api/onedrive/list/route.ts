import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { tryListChildren } from "@/lib/onedrive/folders";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const folderPath = req.nextUrl.searchParams.get("path") ?? "";
    const withThumbnails = req.nextUrl.searchParams.get("thumbnails") === "true";
    const client = createGraphClient(token);
    const items = await tryListChildren(client, folderPath, { withThumbnails });
    return NextResponse.json({ items });
  } catch (err) {
    return errorResponse(err);
  }
}
