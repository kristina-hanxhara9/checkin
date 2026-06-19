"use client";

import { motion } from "framer-motion";

type Tag = "div" | "span" | "section" | "header" | "h1" | "h2" | "h3" | "p";

interface Props {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
  as?: Tag;
}

const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  section: motion.section,
  header: motion.header,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

/**
 * Scroll-triggered reveal using framer-motion's whileInView.
 * Keeps the same public API as the previous IntersectionObserver version.
 */
export function Reveal({
  children,
  delay = 0,
  yOffset = 24,
  className,
  as = "div",
}: Props) {
  const Tag = MOTION_TAGS[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -80px 0px" }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: delay / 1000,
      }}
    >
      {children}
    </Tag>
  );
}
