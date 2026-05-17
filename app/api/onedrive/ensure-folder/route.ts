import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { ensureFolder } from "@/lib/onedrive/folders";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const { folderPath } = (await req.json()) as { folderPath: string };
    if (!folderPath) {
      return NextResponse.json({ error: "folderPath required" }, { status: 400 });
    }
    const client = createGraphClient(token);
    await ensureFolder(client, folderPath);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
