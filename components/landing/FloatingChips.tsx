import { CheckCircle2, Sparkles } from "lucide-react";

/**
 * Floating UI hint chips positioned around the hero illustration to make the
 * page feel alive — like glimpses of the product in action.
 */
export function FloatingChips() {
  return (
    <>
      {/* Top-left: "Categorising kitchen…" */}
      <div className="float-slow absolute -left-3 top-6 z-10 hidden md:block">
        <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Categorising kitchen…</span>
        </div>
      </div>

      {/* Bottom-right: "PDF ready · 12 items" */}
      <div className="float-fast absolute -right-2 bottom-8 z-10 hidden md:block">
        <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>PDF ready · 12 items</span>
        </div>
      </div>

      {/* Middle-right offset: rating chip */}
      <div className="float-medium absolute right-4 top-1/3 z-10 hidden md:block">
        <div className="glass rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          Good
        </div>
      </div>
    </>
  );
}
