import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function PricingTeaser() {
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <PlanCard
        title="Hosted SaaS"
        price="£39"
        priceSuffix="/ month"
        tagline="Sign up in 5 minutes. We handle hosting and AI costs."
        features={HOSTED_FEATURES}
        cta="Sign in to start"
        ctaHref="#hero"
        highlight
      />
      <PlanCard
        title="Self-hosted"
        price="£2,000"
        priceSuffix="one-off"
        tagline="Your own deployment. Customised. You own the keys."
        features={SELF_FEATURES}
        cta="Contact sales"
        ctaHref={`mailto:${SALES_EMAIL}?subject=PropertyCheck%20self-hosted%20enquiry`}
      />
    </section>
  );
}

function PlanCard({
  title,
  price,
  priceSuffix,
  tagline,
  features,
  cta,
  ctaHref,
  highlight,
}: {
  title: string;
  price: string;
  priceSuffix: string;
  tagline: string;
  features: readonly string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`depth-card relative flex flex-col rounded-2xl p-6 ${
        highlight
          ? "bg-gradient-to-br from-emerald-50 to-emerald-100 ring-2 ring-emerald-500"
          : "bg-slate-50 ring-1 ring-slate-200"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Recommended
        </span>
      )}
      <h3 className={`text-xl font-bold ${highlight ? "text-emerald-900" : "text-slate-900"}`}>{title}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-5xl font-bold tracking-tight ${highlight ? "text-emerald-900" : "text-slate-900"}`}>{price}</span>
        <span className={`text-sm ${highlight ? "text-emerald-800/70" : "text-slate-500"}`}>{priceSuffix}</span>
      </div>
      <p className={`mt-2 text-sm ${highlight ? "text-emerald-900/80" : "text-slate-600"}`}>{tagline}</p>
      <ul className="mt-5 flex-1 space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${highlight ? "text-emerald-700" : "text-slate-500"}`} />
            <span className={highlight ? "text-emerald-950" : "text-slate-800"}>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        className={`mt-6 ${
          highlight
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        <a href={ctaHref}>{cta}</a>
      </Button>
    </div>
  );
}
