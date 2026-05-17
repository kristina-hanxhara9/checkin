"use client";

import { useMsal } from "@azure/msal-react";
import { Button } from "@/components/ui/button";
import { loginRequest } from "@/lib/msal/config";

export function SignInButton({ label = "Sign in with Microsoft" }: { label?: string }) {
  const { instance } = useMsal();

  const handleSignIn = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (err) {
      console.error("Sign-in failed", err);
    }
  };

  return (
    <Button size="lg" onClick={handleSignIn}>
      {label}
    </Button>
  );
}

export function SignOutButton() {
  const { instance, accounts } = useMsal();
  if (!accounts.length) return null;
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => instance.logoutPopup({ account: accounts[0] })}
    >
      Sign out
    </Button>
  );
}
