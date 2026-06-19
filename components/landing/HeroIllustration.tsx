import { Sparkles } from "lucide-react";

export function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        viewBox="0 0 480 320"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-hidden="true"
      >
        {/* Left: cluster of photo thumbnails */}
        <g transform="translate(20 50)">
          {/* back photos */}
          <rect x="20" y="20" width="78" height="58" rx="6" className="fill-muted stroke-border" strokeWidth="1" />
          <rect x="32" y="8" width="78" height="58" rx="6" className="fill-muted stroke-border" strokeWidth="1" />
          {/* front photo */}
          <rect x="0" y="35" width="100" height="74" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
          <circle cx="22" cy="55" r="6" className="fill-muted-foreground/40" />
          <path d="M0 95 L34 70 L58 84 L100 56 L100 109 L0 109 Z" className="fill-muted-foreground/30" />
          {/* second photo offset */}
          <rect x="55" y="115" width="100" height="74" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
          <circle cx="78" cy="135" r="6" className="fill-muted-foreground/40" />
          <path d="M55 175 L88 152 L114 165 L155 138 L155 189 L55 189 Z" className="fill-muted-foreground/30" />
          {/* third photo */}
          <rect x="0" y="155" width="100" height="74" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
          <circle cx="22" cy="175" r="6" className="fill-muted-foreground/40" />
          <path d="M0 215 L34 190 L58 204 L100 176 L100 229 L0 229 Z" className="fill-muted-foreground/30" />
        </g>

        {/* Center: arrow */}
        <g transform="translate(200 140)">
          <line x1="0" y1="20" x2="60" y2="20" className="stroke-foreground" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M55 14 L65 20 L55 26" className="fill-none stroke-foreground" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Right: PDF document */}
        <g transform="translate(310 35)">
          {/* shadow */}
          <rect x="6" y="6" width="148" height="200" rx="8" className="fill-foreground/10" />
          {/* page */}
          <rect x="0" y="0" width="148" height="200" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
          {/* header strip */}
          <rect x="0" y="0" width="148" height="32" rx="8" className="fill-foreground" />
          <rect x="0" y="22" width="148" height="10" className="fill-foreground" />
          <rect x="12" y="12" width="40" height="8" rx="2" className="fill-card" />
          {/* title line */}
          <rect x="12" y="44" width="80" height="6" rx="2" className="fill-foreground/80" />
          {/* meta */}
          <rect x="12" y="58" width="120" height="3" rx="1" className="fill-muted-foreground/50" />
          <rect x="12" y="65" width="100" height="3" rx="1" className="fill-muted-foreground/50" />
          {/* photo row */}
          <rect x="12" y="78" width="28" height="20" rx="2" className="fill-muted" />
          <rect x="44" y="78" width="28" height="20" rx="2" className="fill-muted" />
          <rect x="76" y="78" width="28" height="20" rx="2" className="fill-muted" />
          {/* items table — 4 rows */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(0 ${110 + i * 18})`}>
              <rect x="12" y="0" width="42" height="4" rx="1" className="fill-foreground/70" />
              <rect x="58" y="0" width="20" height="4" rx="1" className="fill-emerald-500/70" />
              <rect x="82" y="0" width="54" height="4" rx="1" className="fill-muted-foreground/40" />
            </g>
          ))}
        </g>
      </svg>

      {/* AI badge floating in the middle of the arrow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="ai-badge inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-lg">
          <Sparkles className="h-3.5 w-3.5" />
          AI
        </div>
      </div>
    </div>
  );
}
