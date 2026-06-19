"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useSubscription } from "@/lib/hooks/useSubscription";

interface Props {
  children: React.ReactNode;
  /**
   * When true, allows access even without an active subscription. Used by the
   * /subscribe page itself, the /settings page, and the legal pages — so a
   * signed-in user can manage their billing / branding regardless of paid state.
   */
  allowUnsubscribed?: boolean;
}

export function AuthGuard({ children, allowUnsubscribed = false }: Props) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const router = useRouter();
  const { subscription, isActive, isLoading: subLoading, isError: subError } = useSubscription();

  useEffect(() => {
    if (!isAuthenticated && inProgress === "none") {
      router.replace("/");
      return;
    }
    if (!isAuthenticated || allowUnsubscribed) return;
    if (subLoading) return;
    // Treat error as "no subscription" — gate the user to /subscribe so they can fix it.
    if (subError || !isActive) {
      router.replace("/subscribe");
    }
  }, [isAuthenticated, inProgress, allowUnsubscribed, subLoading, subError, isActive, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking sign-in…
      </div>
    );
  }

  if (!allowUnsubscribed && (subLoading || (!isActive && !subscription))) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking subscription…
      </div>
    );
  }

  return <>{children}</>;
}
