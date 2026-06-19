import { Sparkles } from "lucide-react";

export function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* coloured backdrop blob */}
      <div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(125,211,252,0.35), transparent 60%), radial-gradient(circle at 80% 70%, rgba(134,239,172,0.35), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 480 320"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-hidden="true"
      >
        {/* Left: cluster of photo thumbnails (sky-blue accents) */}
        <g transform="translate(20 50)">
          {/* back/peek thumbs */}
          <rect x="20" y="20" width="78" height="58" rx="6" className="fill-sky-100" stroke="#bae6fd" strokeWidth="1" />
          <rect x="32" y="8" width="78" height="58" rx="6" className="fill-sky-100" stroke="#bae6fd" strokeWidth="1" />
          {/* photo 1 */}
          <rect x="0" y="35" width="100" height="74" rx="8" className="fill-white" stroke="#7dd3fc" strokeWidth="1.5" />
          <circle cx="22" cy="55" r="6" className="fill-sky-400" />
          <path d="M0 95 L34 70 L58 84 L100 56 L100 109 L0 109 Z" className="fill-sky-300" />
          {/* photo 2 */}
          <rect x="55" y="115" width="100" height="74" rx="8" className="fill-white" stroke="#7dd3fc" strokeWidth="1.5" />
          <circle cx="78" cy="135" r="6" className="fill-sky-400" />
          <path d="M55 175 L88 152 L114 165 L155 138 L155 189 L55 189 Z" className="fill-sky-300" />
          {/* photo 3 */}
          <rect x="0" y="155" width="100" height="74" rx="8" className="fill-white" stroke="#7dd3fc" strokeWidth="1.5" />
          <circle cx="22" cy="175" r="6" className="fill-sky-400" />
          <path d="M0 215 L34 190 L58 204 L100 176 L100 229 L0 229 Z" className="fill-sky-300" />
        </g>

        {/* Centre arrow */}
        <g transform="translate(195 140)">
          <line x1="0" y1="20" x2="70" y2="20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <path d="M62 13 L72 20 L62 27" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Right: PDF (emerald accent) */}
        <g transform="translate(310 35)">
          {/* shadow */}
          <rect x="6" y="6" width="148" height="200" rx="8" className="fill-emerald-200/70" />
          {/* page */}
          <rect x="0" y="0" width="148" height="200" rx="8" className="fill-white" stroke="#86efac" strokeWidth="1.5" />
          {/* header */}
          <rect x="0" y="0" width="148" height="32" rx="8" className="fill-emerald-700" />
          <rect x="0" y="22" width="148" height="10" className="fill-emerald-700" />
          <rect x="12" y="12" width="40" height="8" rx="2" className="fill-white" />
          {/* title */}
          <rect x="12" y="44" width="80" height="6" rx="2" className="fill-slate-800" />
          {/* meta */}
          <rect x="12" y="58" width="120" height="3" rx="1" className="fill-slate-400" />
          <rect x="12" y="65" width="100" height="3" rx="1" className="fill-slate-400" />
          {/* photo row */}
          <rect x="12" y="78" width="28" height="20" rx="2" className="fill-emerald-100" stroke="#a7f3d0" strokeWidth="1" />
          <rect x="44" y="78" width="28" height="20" rx="2" className="fill-emerald-100" stroke="#a7f3d0" strokeWidth="1" />
          <rect x="76" y="78" width="28" height="20" rx="2" className="fill-emerald-100" stroke="#a7f3d0" strokeWidth="1" />
          {/* items */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(0 ${110 + i * 18})`}>
              <rect x="12" y="0" width="42" height="4" rx="1" className="fill-slate-800" />
              <rect x="58" y="0" width="20" height="4" rx="1.5" className={i === 2 ? "fill-amber-500" : "fill-emerald-500"} />
              <rect x="82" y="0" width="54" height="4" rx="1" className="fill-slate-300" />
            </g>
          ))}
        </g>
      </svg>

      {/* AI badge — amber for the "AI" middle stage */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="ai-badge inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
          <Sparkles className="h-3.5 w-3.5" />
          AI
        </div>
      </div>
    </div>
  );
}
