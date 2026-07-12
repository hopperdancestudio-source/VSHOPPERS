"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, revealViewport, staggerContainer } from "@/lib/motion";

/** Fades + slides a single block up into view on scroll. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children?: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Staggers its direct motion children in as a group scrolls into view. */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
    >
      {children}
    </motion.div>
  );
}

export { fadeUp as revealItem };
