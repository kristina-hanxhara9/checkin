"use client";

import { useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "@/lib/msal/config";

export type GetTokenFn = (opts?: { forceRefresh?: boolean }) => Promise<string>;

export function useGraphToken() {
  const { instance, accounts } = useMsal();

  const getToken: GetTokenFn = useCallback(
    async ({ forceRefresh = false } = {}): Promise<string> => {
      const account = accounts[0];
      if (!account) throw new Error("Not signed in");
      try {
        const result = await instance.acquireTokenSilent({
          ...loginRequest,
          account,
          forceRefresh,
        });
        return result.accessToken;
      } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
          const result = await instance.acquireTokenPopup({ ...loginRequest, account });
          return result.accessToken;
        }
        throw err;
      }
    },
    [instance, accounts]
  );

  return { getToken, account: accounts[0] };
}

export async function authedFetch(
  getToken: GetTokenFn,
  url: string,
  init: RequestInit = {}
): Promise<Response> {
  const send = async (token: string) => {
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return fetch(url, { ...init, headers });
  };

  const token = await getToken();
  const res = await send(token);
  if (res.status === 401) {
    // Token may have been rejected by the API; force-refresh and retry once.
    try {
      const fresh = await getToken({ forceRefresh: true });
      return await send(fresh);
    } catch {
      return res;
    }
  }
  return res;
}
