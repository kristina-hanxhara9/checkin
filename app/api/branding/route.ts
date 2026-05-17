import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, errorResponse } from "@/lib/api/auth";
import { createGraphClient } from "@/lib/onedrive/client";
import { ensureFolder } from "@/lib/onedrive/folders";
import { downloadJson, saveJson } from "@/lib/onedrive/files";
import { buildBrandingJsonPath } from "@/lib/onedrive/paths";
import { ROOT_FOLDER } from "@/lib/constants";
import { DEFAULT_BRANDING, type Branding } from "@/types/branding";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const client = createGraphClient(token);
    try {
      const data = await downloadJson<Branding>(client, buildBrandingJsonPath());
      return NextResponse.json(data);
    } catch (err) {
      if (isNotFound(err)) {
        return NextResponse.json(DEFAULT_BRANDING);
      }
      throw err;
    }
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    const body = (await req.json()) as Partial<Branding>;
    if (!body.businessName || typeof body.businessName !== "string") {
      return NextResponse.json({ error: "businessName is required" }, { status: 400 });
    }
    const client = createGraphClient(token);
    await ensureFolder(client, ROOT_FOLDER);
    const next: Branding = {
      businessName: body.businessName.trim(),
      contactEmail: body.contactEmail?.trim() || undefined,
      contactPhone: body.contactPhone?.trim() || undefined,
      address: body.address?.trim() || undefined,
      logoFilename: body.logoFilename || undefined,
      updatedAt: new Date().toISOString(),
    };
    await saveJson(client, buildBrandingJsonPath(), next);
    return NextResponse.json(next);
  } catch (err) {
    return errorResponse(err);
  }
}

function isNotFound(err: unknown): boolean {
  if (typeof err === "object" && err !== null) {
    const e = err as { statusCode?: number; code?: string; message?: string };
    if (e.statusCode === 404 || e.code === "itemNotFound") return true;
    if (e.message?.includes("404")) return true;
  }
  return false;
}
