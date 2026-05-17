import { Client } from "@microsoft/microsoft-graph-client";
import { downloadJson } from "@/lib/onedrive/files";
import { getItem } from "@/lib/onedrive/folders";
import { buildBrandingJsonPath, buildLogoPath } from "@/lib/onedrive/paths";
import { DEFAULT_BRANDING, type Branding } from "@/types/branding";

export interface ResolvedBranding {
  branding: Branding;
  logoDataUrl: string | null;
}

export async function loadBranding(client: Client): Promise<ResolvedBranding> {
  let branding: Branding;
  try {
    branding = await downloadJson<Branding>(client, buildBrandingJsonPath());
  } catch {
    branding = DEFAULT_BRANDING;
  }

  let logoDataUrl: string | null = null;
  if (branding.logoFilename) {
    try {
      const item = await getItem(client, buildLogoPath(branding.logoFilename));
      const url = item?.["@microsoft.graph.downloadUrl"];
      if (url) {
        const res = await fetch(url);
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          const mime = res.headers.get("content-type")?.split(";")[0] ?? guessMime(branding.logoFilename);
          logoDataUrl = `data:${mime};base64,${buf.toString("base64")}`;
        }
      }
    } catch {
      // ignore logo-load failures — fall back to text-only header
    }
  }

  return { branding, logoDataUrl };
}

function guessMime(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "svg": return "image/svg+xml";
    case "webp": return "image/webp";
    default: return "image/png";
  }
}
