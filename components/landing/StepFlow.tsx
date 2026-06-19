import { Camera, Sparkles, FileText } from "lucide-react";

export function StepFlow() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <StepCard
        number="1"
        label="Upload"
        title="Drop photos"
        body="Walk the property, take photos as you go. Drag-drop or shoot from your phone."
        visual={<PhotosVisual />}
        icon={<Camera className="h-4 w-4" />}
      />
      <StepCard
        number="2"
        label="Categorise"
        title="AI does the typing"
        body="Rooms and items detected automatically. Each rated Good · Fair · Poor with notes."
        visual={<CategoriseVisual />}
        icon={<Sparkles className="h-4 w-4" />}
      />
      <StepCard
        number="3"
        label="Deliver"
        title="Branded PDF"
        body="A clean condition report — and at end-of-tenancy, an AI deposit comparison."
        visual={<PdfVisual />}
        icon={<FileText className="h-4 w-4" />}
      />
    </section>
  );
}

function StepCard({
  number,
  label,
  title,
  body,
  visual,
  icon,
}: {
  number: string;
  label: string;
  title: string;
  body: string;
  visual: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-muted/40 p-3">
        {visual}
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
          {number}
        </span>
        <span className="inline-flex items-center gap-1">{icon} {label}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function PhotosVisual() {
  return (
    <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <g key={i} transform={`translate(${10 + col * 48} ${10 + row * 42})`}>
            <rect width="40" height="32" rx="4" className="fill-card stroke-border" strokeWidth="1" />
            <circle cx="9" cy="11" r="3" className="fill-muted-foreground/40" />
            <path d="M0 26 L13 18 L23 23 L40 13 L40 32 L0 32 Z" className="fill-muted-foreground/30" />
          </g>
        );
      })}
    </svg>
  );
}

function CategoriseVisual() {
  return (
    <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto" aria-hidden="true">
      <rect x="12" y="10" width="136" height="80" rx="8" className="fill-card stroke-border" strokeWidth="1" />
      <rect x="22" y="20" width="60" height="6" rx="2" className="fill-foreground" />
      <rect x="115" y="20" width="22" height="6" rx="3" className="fill-emerald-500/80" />
      {[36, 50, 64, 78].map((y, i) => (
        <g key={i}>
          <rect x="22" y={y} width="50" height="4" rx="1" className="fill-foreground/70" />
          <rect x="80" y={y} width={18 - (i % 2) * 4} height="4" rx="1" className={i % 3 === 0 ? "fill-amber-500/80" : "fill-emerald-500/80"} />
          <rect x="105" y={y} width="32" height="4" rx="1" className="fill-muted-foreground/40" />
        </g>
      ))}
    </svg>
  );
}

function PdfVisual() {
  return (
    <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto" aria-hidden="true">
      <rect x="50" y="8" width="74" height="86" rx="6" className="fill-foreground/10" />
      <rect x="44" y="4" width="74" height="86" rx="6" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="44" y="4" width="74" height="14" rx="6" className="fill-foreground" />
      <rect x="44" y="12" width="74" height="6" className="fill-foreground" />
      <rect x="50" y="8" width="22" height="6" rx="1" className="fill-card" />
      <rect x="50" y="26" width="48" height="4" rx="1" className="fill-foreground/70" />
      <rect x="50" y="34" width="62" height="2" rx="1" className="fill-muted-foreground/50" />
      <rect x="50" y="40" width="50" height="2" rx="1" className="fill-muted-foreground/50" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={50 + i * 22} y={48} width="18" height="14" rx="2" className="fill-muted" />
      ))}
      {[68, 76, 84].map((y, i) => (
        <g key={y}>
          <rect x="50" y={y} width="22" height="3" rx="1" className="fill-foreground/70" />
          <rect x="74" y={y} width="10" height="3" rx="1" className={i === 1 ? "fill-amber-500/80" : "fill-emerald-500/80"} />
          <rect x="88" y={y} width="28" height="3" rx="1" className="fill-muted-foreground/40" />
        </g>
      ))}
    </svg>
  );
}
