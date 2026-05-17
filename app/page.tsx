"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Home, FileCheck, Camera, ScrollText } from "lucide-react";
import { SignInButton } from "@/components/auth/SignInButton";

export default function Landing() {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && inProgress === "none") {
      router.replace("/properties");
    }
  }, [isAuthenticated, inProgress, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container flex min-h-screen flex-col items-center justify-center py-16">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Home className="h-7 w-7" />
          PropertyCheck
        </div>
        <h1 className="mt-6 max-w-2xl text-center text-4xl font-bold tracking-tight md:text-5xl">
          AI-powered rental inspections
        </h1>
        <p className="mt-4 max-w-xl text-center text-lg text-muted-foreground">
          Upload photos, get a structured condition report, and produce a deposit-comparison PDF — all
          saved to your OneDrive.
        </p>

        <div className="mt-8">
          <SignInButton />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          We never store your data — everything lives in your own OneDrive.
        </p>

        <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          <Feature icon={<Camera />} title="Bulk photo upload" body="Drop unsorted inspection photos. We figure out the rooms." />
          <Feature icon={<FileCheck />} title="AI categorisation" body="Gemini rates every item Good / Fair / Poor with notes." />
          <Feature icon={<ScrollText />} title="Deposit comparison" body="Side-by-side report compliant with UK Tenant Fees Act." />
        </div>

        <footer className="mt-16 flex items-center gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <span>·</span>
          <Link href="/help" className="hover:underline">Help</Link>
        </footer>
      </div>
    </main>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{body}</div>
    </div>
  );
}
