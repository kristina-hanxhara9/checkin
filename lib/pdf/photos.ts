import { Client } from "@microsoft/microsoft-graph-client";
import { tryListChildren } from "@/lib/onedrive/folders";

export type PhotoDataUrls = Record<string, string>;

export async function fetchPhotosAsDataUrls(
  client: Client,
  photosFolderPath: string,
  filenames: string[],
  opts: { preferThumbnail?: "small" | "medium" | "large" } = {}
): Promise<PhotoDataUrls> {
  if (filenames.length === 0) return {};
  const wanted = new Set(filenames);
  const items = await tryListChildren(client, photosFolderPath, { withThumbnails: true });
  const matches = items.filter((i) => i.file && wanted.has(i.name));
  const prefer = opts.preferThumbnail ?? "medium";

  const entries = await Promise.all(
    matches.map(async (item) => {
      const url =
        item.thumbnails?.[0]?.[prefer]?.url ??
        item.thumbnails?.[0]?.medium?.url ??
        item.thumbnails?.[0]?.small?.url ??
        item["@microsoft.graph.downloadUrl"];
      if (!url) return [item.name, ""] as const;
      try {
        const res = await fetch(url);
        if (!res.ok) return [item.name, ""] as const;
        const buf = Buffer.from(await res.arrayBuffer());
        const mime = res.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
        return [item.name, `data:${mime};base64,${buf.toString("base64")}`] as const;
      } catch {
        return [item.name, ""] as const;
      }
    })
  );

  const out: PhotoDataUrls = {};
  for (const [name, dataUrl] of entries) {
    if (dataUrl) out[name] = dataUrl;
  }
  return out;
}
