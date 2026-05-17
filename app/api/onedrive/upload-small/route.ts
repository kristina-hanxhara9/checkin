import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { uploadSmallFile } from "@/lib/onedrive/files";
import { MAX_PHOTO_BYTES } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const filePath = req.headers.get("x-file-path");
    const mimeType = req.headers.get("x-mime-type") ?? "application/octet-stream";
    if (!filePath) {
      return NextResponse.json({ error: "X-File-Path header required" }, { status: 400 });
    }
    const buffer = Buffer.from(await req.arrayBuffer());
    if (buffer.byteLength > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: `Photo too large (max ${MAX_PHOTO_BYTES / 1024 / 1024}MB)` },
        { status: 413 }
      );
    }
    const client = createGraphClient(token);
    const result = await uploadSmallFile(client, filePath, buffer, mimeType);
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
