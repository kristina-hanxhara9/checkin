"use client";

import { useQuery } from "@tanstack/react-query";
import type { TenancyState } from "@/lib/onedrive/stateDerivation";
import { useGraphToken, authedFetch } from "./useGraphToken";

export function useTenancyState(propertySlug: string, tenancySlug: string) {
  const { getToken } = useGraphToken();
  return useQuery<TenancyState>({
    queryKey: ["tenancyState", propertySlug, tenancySlug],
    queryFn: async () => {
      const res = await authedFetch(
        getToken,
        `/api/onedrive/tenancy-state?property=${encodeURIComponent(propertySlug)}&tenancy=${encodeURIComponent(tenancySlug)}`
      );
      if (!res.ok) throw new Error(`Failed to read tenancy state (${res.status})`);
      return res.json();
    },
    staleTime: 10_000,
  });
}
