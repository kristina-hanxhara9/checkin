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
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <PlanCard
        kind="hosted"
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
        kind="self"
        title="Self-hosted"
        price="£2,000"
        priceSuffix="one-off"
        tagline="Your own deployment. Customised, you own the keys."
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
  kind: "hosted" | "self";
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
      className={`relative flex flex-col rounded-xl border p-6 ${
        highlight ? "border-foreground bg-card shadow-sm" : "bg-card"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
          Recommended
        </span>
      )}
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight">{price}</span>
        <span className="text-sm text-muted-foreground">{priceSuffix}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{tagline}</p>
      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button asChild className="mt-6" variant={highlight ? "default" : "outline"}>
        <a href={ctaHref}>{cta}</a>
      </Button>
    </div>
  );
}
