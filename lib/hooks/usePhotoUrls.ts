"use client";

import { useQuery } from "@tanstack/react-query";
import { authedFetch, useGraphToken } from "./useGraphToken";
import type { DriveItem } from "@/lib/onedrive/folders";

export interface PhotoUrls {
  byFilename: Record<string, { thumb?: string; full?: string }>;
}

export function usePhotoUrls(folderPath: string, enabled = true) {
  const { getToken } = useGraphToken();
  return useQuery<PhotoUrls>({
    queryKey: ["photoUrls", folderPath],
    enabled,
    queryFn: async () => {
      const res = await authedFetch(
        getToken,
        `/api/onedrive/list?path=${encodeURIComponent(folderPath)}&thumbnails=true`
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Failed to list photos (${res.status})`);
      }
      const { items } = (await res.json()) as { items: DriveItem[] };
      const byFilename: PhotoUrls["byFilename"] = {};
      for (const item of items) {
        if (!item.file) continue;
        const thumb = item.thumbnails?.[0]?.medium?.url ?? item.thumbnails?.[0]?.small?.url;
        byFilename[item.name] = {
          thumb,
          full: item["@microsoft.graph.downloadUrl"],
        };
      }
      return { byFilename };
    },
    staleTime: 60_000,
  });
}
