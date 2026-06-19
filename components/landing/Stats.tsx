"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
}

const STATS: Stat[] = [
  { value: 2, suffix: "h", label: "saved per inspection", description: "vs typing inventories by hand" },
  { value: 60, label: "photos per inspection", description: "automatically grouped by room" },
  { value: 3, label: "PDFs per tenancy", description: "check-in · check-out · comparison" },
];

export function Stats() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
      {STATS.map((s, i) => (
        <StatCard key={s.label} stat={s} delay={i * 120} />
      ))}
    </div>
  );
}

function StatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();
  const value = useCountUp(stat.value, visible, 1100);

  return (
    <div
      ref={ref}
      className="depth-card relative overflow-hidden rounded-2xl bg-white p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-baseline gap-1 text-5xl font-bold tracking-tight md:text-6xl">
        {stat.prefix && <span className="text-2xl text-muted-foreground">{stat.prefix}</span>}
        <span className="bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
          {value}
        </span>
        {stat.suffix && <span className="text-2xl text-muted-foreground">{stat.suffix}</span>}
      </div>
      <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-foreground">{stat.label}</div>
      <div className="mt-1 text-sm text-muted-foreground">{stat.description}</div>
    </div>
  );
}

function useCountUp(target: number, start: boolean, durationMs: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (target === 0) {
      setValue(0);
      return;
    }
    const startTime = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start, durationMs]);

  return value;
}
