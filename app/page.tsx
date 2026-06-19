"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Home } from "lucide-react";
import { SignInButton } from "@/components/auth/SignInButton";
import { HeroIllustration } from "@/components/landing/HeroIllustration";
import { StepFlow } from "@/components/landing/StepFlow";
import { PdfMockup } from "@/components/landing/PdfMockup";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { PricingTeaser } from "@/components/landing/PricingTeaser";

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
      <header className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Home className="h-5 w-5" />
          PropertyCheck
        </Link>
        <SignInButton label="Sign in" />
      </header>

      {/* Hero */}
      <section id="hero" className="container grid grid-cols-1 items-center gap-10 pb-16 pt-8 md:grid-cols-2 md:gap-16 md:pb-24 md:pt-16">
        <div className="space-y-5">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Rental inspections,
            <br />
            <span className="text-muted-foreground">done in minutes.</span>
          </h1>
          <p className="max-w-md text-base text-muted-foreground md:text-lg">
            Walk the property, snap photos, get an AI-categorised condition report — branded as yours, saved to your OneDrive.
          </p>
          <div className="flex flex-col items-start gap-2 pt-2">
            <SignInButton />
            <p className="text-xs text-muted-foreground">Free first inspection · No credit card</p>
          </div>
        </div>
        <HeroIllustration />
      </section>

      {/* How it works */}
      <section className="container pb-20">
        <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          How it works
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-xl font-semibold tracking-tight md:text-2xl">
          Three steps from photos to a tenant-ready PDF.
        </p>
        <StepFlow />
      </section>

      {/* PDF preview */}
      <section className="container pb-20">
        <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          What you get
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-xl font-semibold tracking-tight md:text-2xl">
          A clean, branded inventory report — every time.
        </p>
        <PdfMockup />
      </section>

      {/* Trust strip */}
      <section className="container pb-12">
        <TrustStrip />
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="container pb-20">
        <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Pricing
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-xl font-semibold tracking-tight md:text-2xl">
          Subscribe to the hosted SaaS, or run your own.
        </p>
        <PricingTeaser />
      </section>

      {/* Final CTA + footer */}
      <footer className="container pb-10 pt-2">
        <div className="mb-8 flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-8 text-center">
          <h3 className="text-xl font-semibold">Ready to try it?</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Your first inspection is free. No credit card. Data stays in your own OneDrive.
          </p>
          <SignInButton />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <span>·</span>
          <Link href="/help" className="hover:underline">Help</Link>
        </div>
      </footer>
    </main>
  );
}
