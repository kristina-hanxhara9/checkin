"use client";

import { Configuration, PublicClientApplication, LogLevel } from "@azure/msal-browser";
import { GRAPH_SCOPES } from "@/lib/constants";

const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID;
const authority = process.env.NEXT_PUBLIC_AZURE_AUTHORITY ?? "https://login.microsoftonline.com/common";
const redirectUri = process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI;

if (typeof window !== "undefined" && !clientId) {
  console.warn("NEXT_PUBLIC_AZURE_CLIENT_ID is not set. Sign-in will fail.");
}

export const msalConfig: Configuration = {
  auth: {
    clientId: clientId ?? "missing-client-id",
    authority,
    redirectUri: redirectUri ?? (typeof window !== "undefined" ? window.location.origin : ""),
    postLogoutRedirectUri: redirectUri ?? (typeof window !== "undefined" ? window.location.origin : ""),
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        if (level === LogLevel.Error) console.error(`[msal] ${message}`);
      },
      logLevel: LogLevel.Warning,
    },
  },
};

export const loginRequest = {
  scopes: GRAPH_SCOPES,
};

let pcaInstance: PublicClientApplication | null = null;

export function getMsalInstance(): PublicClientApplication {
  if (!pcaInstance) {
    pcaInstance = new PublicClientApplication(msalConfig);
  }
  return pcaInstance;
}
