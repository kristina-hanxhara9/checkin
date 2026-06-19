"use client";

import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "header" | "h1" | "h2" | "p" | "span";
}

export function Reveal({ children, delay = 0, className, as: Tag = "div" }: Props) {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transform-none motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
