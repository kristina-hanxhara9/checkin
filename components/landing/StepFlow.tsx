"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles, FileText } from "lucide-react";

type Theme = {
  bg: string;
  ring: string;
  badge: string;
  number: string;
  accent: string;
};

const THEMES: Record<"blue" | "amber" | "emerald", Theme> = {
  blue: {
    bg: "bg-sky-50",
    ring: "ring-sky-200",
    badge: "bg-sky-600 text-white",
    number: "bg-sky-600 text-white",
    accent: "text-sky-700",
  },
  amber: {
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    badge: "bg-amber-500 text-white",
    number: "bg-amber-500 text-white",
    accent: "text-amber-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    badge: "bg-emerald-600 text-white",
    number: "bg-emerald-600 text-white",
    accent: "text-emerald-700",
  },
};

const CONTAINER_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function StepFlow() {
  return (
    <motion.section
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-6 md:grid-cols-3"
    >
      <StepCard
        theme={THEMES.blue}
        number="1"
        label="Upload"
        title="Drop photos"
        body="Walk the property, snap photos. Drag-drop or shoot from your phone."
        visual={<PhotosVisual />}
        icon={<Camera className="h-4 w-4" />}
      />
      <StepCard
        theme={THEMES.amber}
        number="2"
        label="Categorise"
        title="AI does the typing"
        body="Rooms and items detected automatically. Rated Good · Fair · Poor."
        visual={<CategoriseVisual />}
        icon={<Sparkles className="h-4 w-4" />}
      />
      <StepCard
        theme={THEMES.emerald}
        number="3"
        label="Deliver"
        title="Branded PDF"
        body="A condition report — and at end of tenancy, a deposit comparison."
        visual={<PdfVisual />}
        icon={<FileText className="h-4 w-4" />}
      />
    </motion.section>
  );
}

function StepCard({
  theme,
  number,
  label,
  title,
  body,
  visual,
  icon,
}: {
  theme: Theme;
  number: string;
  label: string;
  title: string;
  body: string;
  visual: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      variants={CHILD_VARIANTS}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 320, damping: 20 } }}
      className={`depth-card flex flex-col rounded-2xl p-6 ring-1 ${theme.bg} ${theme.ring}`}
    >
      <div className="mb-5 flex h-40 items-center justify-center">{visual}</div>
      <div className="flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${theme.number}`}>
          {number}
        </span>
        <span className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider ${theme.accent}`}>
          {icon} {label}
        </span>
      </div>
      <h3 className="mt-3 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-foreground/70">{body}</p>
    </motion.div>
  );
}

function PhotosVisual() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <g key={`back-${i}`} transform={`translate(${20 + i * 56} 12)`}>
          <rect width="46" height="36" rx="5" className="fill-white" stroke="#bae6fd" strokeWidth="1.5" />
          <circle cx="11" cy="11" r="3.5" className="fill-sky-300" />
          <path d="M0 30 L15 20 L26 26 L46 14 L46 36 L0 36 Z" className="fill-sky-200" />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={`front-${i}`} transform={`translate(${48 + i * 56} 72)`}>
          <rect width="46" height="36" rx="5" className="fill-white" stroke="#7dd3fc" strokeWidth="1.5" />
          <circle cx="11" cy="11" r="3.5" className="fill-sky-400" />
          <path d="M0 30 L15 20 L26 26 L46 14 L46 36 L0 36 Z" className="fill-sky-300" />
        </g>
      ))}
    </svg>
  );
}

function CategoriseVisual() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto" aria-hidden="true">
      <rect x="14" y="14" width="172" height="112" rx="10" className="fill-white" stroke="#fde68a" strokeWidth="1.5" />
      <rect x="28" y="28" width="62" height="8" rx="2" className="fill-slate-800" />
      <rect x="148" y="28" width="28" height="8" rx="4" className="fill-amber-400" />
      <path d="M168 50 l2 -4 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 z" className="fill-amber-500" />
      {[50, 66, 82, 98].map((y, i) => (
        <g key={y}>
          <rect x="28" y={y} width="56" height="5" rx="1.5" className="fill-slate-700" />
          <rect x="92" y={y} width="22" height="5" rx="2.5" className={i === 1 ? "fill-amber-500" : "fill-emerald-500"} />
          <rect x="122" y={y} width="50" height="5" rx="1.5" className="fill-slate-300" />
        </g>
      ))}
    </svg>
  );
}

function PdfVisual() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto" aria-hidden="true">
      <rect x="58" y="14" width="92" height="120" rx="8" className="fill-emerald-200/60" />
      <rect x="52" y="8" width="92" height="120" rx="8" className="fill-white" stroke="#86efac" strokeWidth="1.5" />
      <rect x="52" y="8" width="92" height="22" rx="8" className="fill-emerald-700" />
      <rect x="52" y="22" width="92" height="8" className="fill-emerald-700" />
      <rect x="62" y="14" width="30" height="8" rx="2" className="fill-white" />
      <rect x="62" y="38" width="56" height="5" rx="1.5" className="fill-slate-800" />
      <rect x="62" y="48" width="72" height="3" rx="1" className="fill-slate-400" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={62 + i * 22} y="58" width="18" height="14" rx="2" className="fill-emerald-100" stroke="#a7f3d0" strokeWidth="1" />
      ))}
      {[82, 92, 102, 112].map((y, i) => (
        <g key={y}>
          <rect x="62" y={y} width="26" height="3" rx="1" className="fill-slate-700" />
          <rect x="92" y={y} width="12" height="3" rx="1.5" className={i === 2 ? "fill-amber-500" : "fill-emerald-500"} />
          <rect x="108" y={y} width="26" height="3" rx="1" className="fill-slate-300" />
        </g>
      ))}
    </svg>
  );
}
