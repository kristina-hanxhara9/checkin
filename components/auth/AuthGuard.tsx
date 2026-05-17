"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && inProgress === "none") {
      router.replace("/");
    }
  }, [isAuthenticated, inProgress, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking sign-in…
      </div>
    );
  }
  return <>{children}</>;
}
