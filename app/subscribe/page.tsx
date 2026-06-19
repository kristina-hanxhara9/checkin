"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Loader2, Lock, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/SignInButton";
import { useGraphToken } from "@/lib/hooks/useGraphToken";
import { useSubscription } from "@/lib/hooks/useSubscription";

type Plan = "hosted" | "self-hosted";

const HOSTED_FEATURES = [
  "Unlimited properties",
  "AI categorisation + comparison",
  "Branded PDFs to your OneDrive",
  "Email support",
] as const;

const SELF_FEATURES = [
  "Your domain, your branding",
  "Deployed to your infrastructure",
  "You pay only for the AI you use",
  "1 year of email support",
] as const;

const SALES_EMAIL = "kristinazhi97@gmail.com";

export default function SubscribePage() {
  const { account } = useGraphToken();
  const { subscription, isLoading } = useSubscription();

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-amber-50/30">
      <header className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <HomeIcon className="h-5 w-5" />
          PropertyCheck
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {account && <span className="hidden text-muted-foreground sm:inline">{account.name ?? account.username}</span>}
          <SignOutButton />
        </div>
      </header>

      <div className="container max-w-4xl pb-16 pt-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 ring-1 ring-amber-200">
            <Lock className="h-3 w-3" />
            Subscription required
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Choose a plan to continue
          </h1>
          <p className="mt-3 text-foreground/70">
            Your sign-in is verified. Pick a plan and you&apos;re in. Your data stays in your own OneDrive either way.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : subscription && subscription.status !== "active" ? (
          <div className="mt-10 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm">
            We found a subscription on this account with status <strong>{subscription.status}</strong>. If that&apos;s
            wrong, email <a className="underline" href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>.
          </div>
        ) : null}

        <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <PlanCard plan="hosted" />
          <PlanCard plan="self-hosted" />
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Already paid?{" "}
          <a className="underline" href={`mailto:${SALES_EMAIL}?subject=PropertyCheck%20—%20activate%20my%20account`}>
            Email us to activate your account
          </a>
          .
        </p>
      </div>
    </main>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const { account } = useGraphToken();
  const [working, setWorking] = useState(false);

  const hosted = plan === "hosted";
  const title = hosted ? "Hosted SaaS" : "Self-hosted";
  const price = hosted ? "£39" : "£2,000";
  const suffix = hosted ? "/ month" : "one-off";
  const tagline = hosted
    ? "Sign up in 5 minutes. We handle hosting and AI costs."
    : "Your own deployment. Customised. You own the keys.";
  const features = hosted ? HOSTED_FEATURES : SELF_FEATURES;

  const handleHostedCheckout = async () => {
    setWorking(true);
    try {
      // TODO: replace with Stripe Checkout session redirect once Stripe is wired:
      //   const res = await fetch("/api/checkout/stripe", { method: "POST" });
      //   const { url } = await res.json();
      //   window.location.href = url;
      //
      // For now, surface a clear path to manual onboarding.
      toast.info("Stripe checkout coming soon. Please email to activate.", { duration: 6000 });
      window.location.href = `mailto:${SALES_EMAIL}?subject=PropertyCheck%20—%20activate%20Hosted%20plan&body=Account:%20${encodeURIComponent(account?.username ?? "")}`;
    } finally {
      setWorking(false);
    }
  };

  const handleSelfHostedEnquiry = () => {
    window.location.href = `mailto:${SALES_EMAIL}?subject=PropertyCheck%20—%20self-hosted%20enquiry&body=Account:%20${encodeURIComponent(account?.username ?? "")}`;
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 transition-transform hover:-translate-y-0.5 ${
        hosted
          ? "bg-gradient-to-br from-emerald-50 to-emerald-100 ring-2 ring-emerald-500"
          : "bg-slate-50 ring-1 ring-slate-200"
      }`}
    >
      {hosted && (
        <span className="absolute -top-3 left-6 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Recommended
        </span>
      )}
      <h3 className={`text-xl font-bold ${hosted ? "text-emerald-900" : "text-slate-900"}`}>{title}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-5xl font-bold tracking-tight ${hosted ? "text-emerald-900" : "text-slate-900"}`}>{price}</span>
        <span className={`text-sm ${hosted ? "text-emerald-800/70" : "text-slate-500"}`}>{suffix}</span>
      </div>
      <p className={`mt-2 text-sm ${hosted ? "text-emerald-900/80" : "text-slate-600"}`}>{tagline}</p>
      <ul className="mt-5 flex-1 space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${hosted ? "text-emerald-700" : "text-slate-500"}`} />
            <span className={hosted ? "text-emerald-950" : "text-slate-800"}>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={hosted ? handleHostedCheckout : handleSelfHostedEnquiry}
        disabled={working}
        className={`mt-6 ${
          hosted
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {working ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            Redirecting…
          </>
        ) : hosted ? (
          "Start subscription"
        ) : (
          "Contact sales"
        )}
      </Button>
    </div>
  );
}
