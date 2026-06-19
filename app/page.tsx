"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Home } from "lucide-react";
import { SignInButton } from "@/components/auth/SignInButton";
import { HeroIllustration } from "@/components/landing/HeroIllustration";
import { FloatingChips } from "@/components/landing/FloatingChips";
import { StepFlow } from "@/components/landing/StepFlow";
import { PdfMockup } from "@/components/landing/PdfMockup";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { Stats } from "@/components/landing/Stats";
import { UseCases } from "@/components/landing/UseCases";
import { DotGrid } from "@/components/landing/DotGrid";
import { Reveal } from "@/components/landing/Reveal";

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
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Header */}
      <header className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <Home className="h-5 w-5" />
          PropertyCheck
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <a href="#how" className="hidden text-muted-foreground hover:text-foreground sm:inline">How it works</a>
          <a href="#preview" className="hidden text-muted-foreground hover:text-foreground sm:inline">Preview</a>
          <a href="#pricing" className="hidden text-muted-foreground hover:text-foreground sm:inline">Pricing</a>
          <SignInButton label="Sign in" />
        </div>
      </header>

      {/* Hero — mesh-gradient backdrop + dot grid + floating chips */}
      <section id="hero" className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(50% 60% at 20% 20%, rgba(186,230,253,0.55), transparent 70%)," +
              "radial-gradient(40% 50% at 80% 10%, rgba(254,243,199,0.6), transparent 70%)," +
              "radial-gradient(40% 50% at 70% 80%, rgba(187,247,208,0.6), transparent 70%)," +
              "radial-gradient(30% 40% at 10% 90%, rgba(196,181,253,0.4), transparent 70%)",
          }}
        />
        <DotGrid className="-z-10" />

        <div className="container grid grid-cols-1 items-center gap-12 pb-20 pt-12 md:grid-cols-2 md:gap-16 md:pb-32 md:pt-24">
          <div className="space-y-7">
            <Reveal as="span" className="inline-block">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 shadow-sm backdrop-blur">
                ✨ Powered by Gemini 3.5
              </span>
            </Reveal>
            <Reveal as="h1" delay={80} className="text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              Rental inspections,
              <br />
              <span className="animated-gradient-text bg-gradient-to-r from-sky-600 via-emerald-600 to-amber-600 bg-clip-text text-transparent">
                done in minutes.
              </span>
            </Reveal>
            <Reveal as="p" delay={160} className="max-w-md text-base text-foreground/70 md:text-lg">
              Walk the property. Snap photos. Get an AI-categorised condition report — branded as yours, saved straight to your OneDrive.
            </Reveal>
            <Reveal delay={240} className="flex flex-col items-start gap-2 pt-1">
              <SignInButton />
              <p className="text-xs text-muted-foreground">Subscribe to start · Cancel anytime · Your data, your OneDrive</p>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <FloatingChips />
            <HeroIllustration />
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="container max-w-5xl">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">By the numbers</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Built to remove the busywork.
              </h2>
            </div>
          </Reveal>
          <Stats />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative isolate overflow-hidden bg-slate-50/60 py-20">
        <DotGrid className="-z-10 opacity-50" />
        <div className="container">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">How it works</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Three steps from photos to PDF.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <StepFlow />
          </Reveal>
        </div>
      </section>

      {/* PDF preview */}
      <section id="preview" className="bg-gradient-to-b from-amber-50/40 via-white to-white py-20">
        <div className="container">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">What you get</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                A clean, branded inventory report — every time.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="pdf-shadow rounded-2xl">
              <PdfMockup />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-white py-20">
        <div className="container max-w-5xl">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Who it's for</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Whether you manage one property or two hundred.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <UseCases />
          </Reveal>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-slate-50 py-12">
        <div className="container">
          <Reveal>
            <TrustStrip />
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gradient-to-b from-white to-emerald-50/40 py-20">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Pricing</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Subscribe, or run your own.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <PricingTeaser />
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative isolate overflow-hidden bg-slate-900 py-20 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(50% 60% at 20% 50%, rgba(125,211,252,0.55), transparent)," +
              "radial-gradient(50% 60% at 80% 50%, rgba(167,243,208,0.55), transparent)",
          }}
        />
        <div className="container max-w-2xl text-center">
          <Reveal>
            <h3 className="text-4xl font-bold tracking-tight">Ready to try it?</h3>
            <p className="mx-auto mt-4 max-w-md text-base text-slate-300">
              Sign in, choose a plan, run your first inspection in under five minutes.
            </p>
            <div className="mt-7 flex justify-center">
              <SignInButton />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="container flex flex-wrap items-center justify-center gap-4 py-10 text-xs text-muted-foreground">
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
