"use client";

import { useQuery } from "@tanstack/react-query";
import { authedFetch, useGraphToken } from "./useGraphToken";
import { DEFAULT_BRANDING, type Branding } from "@/types/branding";

export function useBranding() {
  const { getToken, account } = useGraphToken();
  return useQuery<Branding>({
    queryKey: ["branding"],
    enabled: Boolean(account),
    queryFn: async () => {
      const res = await authedFetch(getToken, "/api/branding");
      if (!res.ok) return DEFAULT_BRANDING;
      return (await res.json()) as Branding;
    },
    staleTime: 60_000,
  });
}

export function useLogoUrl(filename: string | undefined) {
  const { getToken, account } = useGraphToken();
  return useQuery<string | null>({
    queryKey: ["logoUrl", filename],
    enabled: Boolean(account && filename),
    queryFn: async () => {
      if (!filename) return null;
      const res = await authedFetch(
        getToken,
        `/api/branding/logo-url?filename=${encodeURIComponent(filename)}`
      );
      if (!res.ok) return null;
      const json = (await res.json()) as { url: string | null };
      return json.url;
    },
    staleTime: 30 * 60_000,
  });
}
