import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { ensureFolder } from "@/lib/onedrive/folders";
import { uploadSmallFile } from "@/lib/onedrive/files";
import { buildLogoPath } from "@/lib/onedrive/paths";
import {
  ALLOWED_LOGO_EXTENSIONS,
  LOGO_BASENAME,
  MAX_LOGO_BYTES,
  ROOT_FOLDER,
} from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MIME_TO_EXT: Record<string, (typeof ALLOWED_LOGO_EXTENSIONS)[number]> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/svg+xml": "svg",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const contentType = req.headers.get("content-type")?.split(";")[0]?.toLowerCase() ?? "";
    const ext = MIME_TO_EXT[contentType];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type. Use PNG, JPG, SVG, or WebP." },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await req.arrayBuffer());
    if (buffer.byteLength > MAX_LOGO_BYTES) {
      return NextResponse.json(
        { error: `Logo too large. Max ${MAX_LOGO_BYTES / 1024 / 1024}MB.` },
        { status: 400 }
      );
    }
    const client = createGraphClient(token);
    await ensureFolder(client, ROOT_FOLDER);
    const filename = `${LOGO_BASENAME}.${ext}`;
    await uploadSmallFile(client, buildLogoPath(filename), buffer, contentType);
    return NextResponse.json({ logoFilename: filename });
  } catch (err) {
    return errorResponse(err);
  }
}
