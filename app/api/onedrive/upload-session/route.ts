import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { createUploadSession } from "@/lib/onedrive/files";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const { filePath } = (await req.json()) as { filePath: string };
    if (!filePath) {
      return NextResponse.json({ error: "filePath required" }, { status: 400 });
    }
    const client = createGraphClient(token);
    const session = await createUploadSession(client, filePath);
    return NextResponse.json(session);
  } catch (err) {
    return errorResponse(err);
  }
}
