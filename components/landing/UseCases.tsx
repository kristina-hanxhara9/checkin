"use client";

import { motion } from "framer-motion";
import { User, Building2, ClipboardCheck } from "lucide-react";

const PERSONAS = [
  {
    icon: User,
    title: "Solo Landlords",
    body: "Skip hiring a clerk. Walk your property, snap photos, get a professional report you can attach to the deposit-protection scheme.",
    accent: "sky" as const,
  },
  {
    icon: Building2,
    title: "Letting Agents",
    body: "Standardise inspections across your portfolio. Branded reports, consistent format, hours saved per property.",
    accent: "amber" as const,
  },
  {
    icon: ClipboardCheck,
    title: "Inventory Clerks",
    body: "AI does the typing — you do the judgement. Process two inspections in the time it used to take for one.",
    accent: "emerald" as const,
  },
];

const ACCENT_CLASSES: Record<"sky" | "amber" | "emerald", { bg: string; icon: string; ring: string }> = {
  sky: { bg: "bg-sky-50", icon: "text-sky-700 bg-sky-100", ring: "ring-sky-200" },
  amber: { bg: "bg-amber-50", icon: "text-amber-700 bg-amber-100", ring: "ring-amber-200" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-700 bg-emerald-100", ring: "ring-emerald-200" },
};

const CONTAINER_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function UseCases() {
  return (
    <motion.div
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-5 md:grid-cols-3"
    >
      {PERSONAS.map((p) => {
        const Icon = p.icon;
        const accent = ACCENT_CLASSES[p.accent];
        return (
          <motion.div
            key={p.title}
            variants={CHILD_VARIANTS}
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 320, damping: 20 } }}
            className={`depth-card flex flex-col rounded-2xl ring-1 ${accent.bg} ${accent.ring} p-6`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.icon}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold tracking-tight">{p.title}</h3>
            <p className="mt-2 text-sm text-foreground/70">{p.body}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
