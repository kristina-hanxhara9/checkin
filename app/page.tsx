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
    <main className="min-h-screen overflow-x-hidden">
      {/* Sticky-ish header */}
      <header className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <Home className="h-5 w-5" />
          PropertyCheck
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <a href="#how" className="hidden text-muted-foreground hover:text-foreground sm:inline">How it works</a>
          <a href="#preview" className="hidden text-muted-foreground hover:text-foreground sm:inline">Preview</a>
          <a href="#pricing" className="hidden text-muted-foreground hover:text-foreground sm:inline">Pricing</a>
          <SignInButton label="Sign in" />
        </div>
      </header>

      {/* Hero — coloured gradient backdrop */}
      <section
        id="hero"
        className="relative isolate overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 30%, rgba(186,230,253,0.5), transparent 70%), radial-gradient(50% 50% at 80% 20%, rgba(254,243,199,0.55), transparent 70%), radial-gradient(50% 50% at 70% 80%, rgba(187,247,208,0.55), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="container grid grid-cols-1 items-center gap-12 pb-16 pt-10 md:grid-cols-2 md:gap-16 md:pb-28 md:pt-20">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 ring-1 ring-amber-200">
              ✨ Powered by Gemini 3.5
            </span>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Rental inspections,
              <br />
              <span className="bg-gradient-to-r from-sky-700 via-emerald-700 to-amber-700 bg-clip-text text-transparent">
                done in minutes.
              </span>
            </h1>
            <p className="max-w-md text-base text-foreground/70 md:text-lg">
              Walk the property, snap photos, get an AI-categorised condition report — branded as yours, saved straight to your OneDrive.
            </p>
            <div className="flex flex-col items-start gap-2 pt-2">
              <SignInButton />
              <p className="text-xs text-muted-foreground">Free first inspection · No credit card</p>
            </div>
          </div>
          <HeroIllustration />
        </div>
      </section>

      {/* How it works — colourful tiles */}
      <section id="how" className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Three steps from photos to PDF.
            </h2>
          </div>
          <StepFlow />
        </div>
      </section>

      {/* PDF preview — warm amber backdrop section */}
      <section id="preview" className="bg-gradient-to-b from-amber-50/60 to-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">What you get</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              A clean, branded inventory report — every time.
            </h2>
          </div>
          <PdfMockup />
        </div>
      </section>

      {/* Trust strip — clean panel */}
      <section className="bg-slate-50 py-12">
        <div className="container">
          <TrustStrip />
        </div>
      </section>

      {/* Pricing — light emerald backdrop */}
      <section id="pricing" className="bg-gradient-to-b from-white to-emerald-50/40 py-20">
        <div className="container max-w-4xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Pricing</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Subscribe, or run your own.
            </h2>
          </div>
          <PricingTeaser />
        </div>
      </section>

      {/* Final CTA — dark band like Google's about page */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="container max-w-2xl text-center">
          <h3 className="text-3xl font-bold tracking-tight">Ready to try it?</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-300">
            Your first inspection is free. No credit card. Data stays in your own OneDrive.
          </p>
          <div className="mt-6 flex justify-center">
            <SignInButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container flex flex-wrap items-center justify-center gap-4 py-8 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} PropertyCheck</span>
        <span className="text-muted-foreground/40">·</span>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <span className="text-muted-foreground/40">·</span>
        <Link href="/terms" className="hover:underline">Terms</Link>
        <span className="text-muted-foreground/40">·</span>
        <Link href="/help" className="hover:underline">Help</Link>
      </footer>
    </main>
  );
}
