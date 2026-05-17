"use client";

import { useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { getMsalInstance } from "@/lib/msal/config";

export function MsalProviderWrapper({ children }: { children: React.ReactNode }) {
  const [instance, setInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    const inst = getMsalInstance();
    inst.initialize().then(() => setInstance(inst));
  }, []);

  if (!instance) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  return <MsalProvider instance={instance}>{children}</MsalProvider>;
}
