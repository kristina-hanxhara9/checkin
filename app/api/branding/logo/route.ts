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

const EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  webp: "image/webp",
};

function extFromFilename(filename: string | null): string | null {
  if (!filename) return null;
  const lower = filename.toLowerCase().split("?")[0].split("#")[0];
  const m = lower.match(/\.([a-z0-9]+)$/);
  return m ? m[1] : null;
}

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const rawContentType = req.headers.get("content-type")?.split(";")[0]?.toLowerCase() ?? "";
    const filenameHeader = req.headers.get("x-filename");

    // Prefer content-type, but fall back to the original filename's extension
    // (browsers sometimes send an empty Content-Type for File objects whose
    // type couldn't be inferred — e.g. HEIC on some platforms).
    let ext = MIME_TO_EXT[rawContentType];
    if (!ext) {
      const fromName = extFromFilename(filenameHeader);
      if (fromName && (ALLOWED_LOGO_EXTENSIONS as readonly string[]).includes(fromName)) {
        ext = fromName === "jpeg" ? "jpg" : (fromName as (typeof ALLOWED_LOGO_EXTENSIONS)[number]);
      }
    }
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type. Use PNG, JPG, SVG, or WebP." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await req.arrayBuffer());
    if (buffer.byteLength === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }
    if (buffer.byteLength > MAX_LOGO_BYTES) {
      return NextResponse.json(
        { error: `Logo too large. Max ${MAX_LOGO_BYTES / 1024 / 1024}MB.` },
        { status: 400 }
      );
    }

    const mimeToStore = EXT_TO_MIME[ext] ?? "application/octet-stream";
    const client = createGraphClient(token);
    await ensureFolder(client, ROOT_FOLDER);
    const filename = `${LOGO_BASENAME}.${ext}`;
    await uploadSmallFile(client, buildLogoPath(filename), buffer, mimeToStore);
    return NextResponse.json({ logoFilename: filename });
  } catch (err) {
    return errorResponse(err);
  }
}
