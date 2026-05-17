"use client";

import Link from "next/link";
import { useMsal } from "@azure/msal-react";
import { Home, Settings } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignInButton";
import { useBranding, useLogoUrl } from "@/lib/hooks/useBranding";

export function PageHeader() {
  const { accounts } = useMsal();
  const userName = accounts[0]?.name ?? accounts[0]?.username ?? "";
  const { data: branding } = useBranding();
  const { data: logoUrl } = useLogoUrl(branding?.logoFilename);

  const businessName = branding?.businessName?.trim() || "PropertyCheck";
  const showLogo = Boolean(logoUrl);

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/properties" className="flex items-center gap-2 font-semibold">
          {showLogo ? (
            <img src={logoUrl!} alt="" className="h-7 w-7 rounded object-contain" />
          ) : (
            <Home className="h-5 w-5" />
          )}
          <span className="truncate">{businessName}</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          {userName && <span className="hidden text-muted-foreground sm:inline">{userName}</span>}
          <Link
            href="/settings"
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm hover:bg-accent"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
            <span className="ml-1 hidden md:inline">Settings</span>
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
