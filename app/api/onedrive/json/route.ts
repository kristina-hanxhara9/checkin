import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { downloadJson, saveJson } from "@/lib/onedrive/files";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const filePath = req.nextUrl.searchParams.get("path");
    if (!filePath) {
      return NextResponse.json({ error: "path query param required" }, { status: 400 });
    }
    const client = createGraphClient(token);
    const data = await downloadJson(client, filePath);
    return NextResponse.json(data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const { filePath, data } = (await req.json()) as { filePath: string; data: unknown };
    if (!filePath) {
      return NextResponse.json({ error: "filePath required" }, { status: 400 });
    }
    const client = createGraphClient(token);
    await saveJson(client, filePath, data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
