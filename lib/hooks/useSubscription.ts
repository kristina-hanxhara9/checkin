"use client";

import { useQuery } from "@tanstack/react-query";
import { authedFetch, useGraphToken } from "./useGraphToken";
import { isActiveSubscription, type Subscription } from "@/types/subscription";

interface SubscriptionResponse {
  subscription: Subscription | null;
}

export function useSubscription() {
  const { getToken, account } = useGraphToken();
  const email = account?.username ?? "";
  const query = useQuery<SubscriptionResponse>({
    queryKey: ["subscription", email],
    enabled: Boolean(account),
    queryFn: async () => {
      const res = await authedFetch(getToken, "/api/subscription", {
        headers: { "x-user-email": email },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Failed to load subscription (${res.status})`);
      }
      return res.json();
    },
    staleTime: 30_000,
  });

  return {
    ...query,
    subscription: query.data?.subscription ?? null,
    isActive: isActiveSubscription(query.data?.subscription),
  };
}
