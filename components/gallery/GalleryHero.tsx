"use client";

import { motion } from "framer-motion";
import { heroWordReveal, staggerContainer } from "@/lib/motion";

export function GalleryHero({
  watermarkWord,
  eyebrow,
  title,
}: {
  watermarkWord: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="relative overflow-hidden bg-bg pt-nav-h">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="container-base relative z-10 flex flex-col items-start justify-between gap-6 py-20 md:flex-row md:items-center"
      >
        <div>
          <motion.p variants={heroWordReveal} className="eyebrow mb-4">
            {eyebrow}
          </motion.p>
          <motion.h1 variants={heroWordReveal} className="font-display text-display-lg text-ink">
            {title}
          </motion.h1>
        </div>

        <motion.span
          variants={heroWordReveal}
          aria-hidden
          className="pointer-events-none select-none whitespace-nowrap font-display text-[12vw] leading-none text-white/5 md:text-[8vw]"
        >
          {watermarkWord}
        </motion.span>
      </motion.div>
    </section>
  );
}
