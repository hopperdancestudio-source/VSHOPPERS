"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { heroWordReveal, staggerContainer } from "@/lib/motion";
import type { PageHeroConfig } from "@/lib/types";
import { PageHeroButtons } from "./PageHeroButtons";

const WIDTH_CLASSES = {
  Small: "max-w-md",
  Medium: "max-w-2xl",
  Large: "max-w-4xl",
  Full: "max-w-none",
};

export function PageHeroContent({ config }: { config: PageHeroConfig }) {
  if (config.pageKey === "gallery") {
    return (
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center w-full">
        <div>
          {config.eyebrow && (
            <motion.p variants={heroWordReveal} className="eyebrow mb-4">
              {config.eyebrow}
            </motion.p>
          )}
          <motion.h1 variants={heroWordReveal} className="font-display text-display-lg text-ink">
            {config.titleLine1}
          </motion.h1>
        </div>
        {config.titleLine2 && (
          <motion.span
            variants={heroWordReveal}
            aria-hidden
            className="pointer-events-none select-none whitespace-nowrap font-display text-[12vw] leading-none text-white/5 md:text-[8vw] md:ml-auto"
          >
            {config.titleLine2}
          </motion.span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={clsx(
        "relative z-10 w-full flex flex-col transition-all duration-300",
        WIDTH_CLASSES[config.contentWidth],
        // Mobile Alignments
        config.mobileAlignment === "Left" && "text-left items-start mx-0",
        config.mobileAlignment === "Center" && "text-center items-center mx-auto",
        config.mobileAlignment === "Right" && "text-right items-end ml-auto mr-0",
        // Desktop Alignments
        config.desktopAlignment === "Left" && "lg:text-left lg:items-start lg:mx-0",
        config.desktopAlignment === "Center" && "lg:text-center lg:items-center lg:mx-auto",
        config.desktopAlignment === "Right" && "lg:text-right lg:items-end lg:ml-auto lg:mr-0"
      )}
    >
      {config.eyebrow && (
        <motion.p variants={heroWordReveal} className="eyebrow mb-4">
          {config.eyebrow}
        </motion.p>
      )}

      {(config.titleLine1 || config.titleLine2) && (
        <h1 className="font-display text-display-lg leading-[0.95] uppercase">
          {config.titleLine1 && (
            <motion.span
              variants={heroWordReveal}
              className="block text-ink"
            >
              {config.titleLine1}
            </motion.span>
          )}
          {config.titleLine2 && (
            <motion.span
              variants={heroWordReveal}
              className="block text-accent"
            >
              {config.titleLine2}
            </motion.span>
          )}
        </h1>
      )}

      {config.description && (
        <motion.p
          variants={heroWordReveal}
          className={clsx(
            "mt-6 max-w-md font-body text-base leading-relaxed text-ink-muted transition-all",
            // Mobile border alignments
            config.mobileAlignment === "Left" ? "border-l-2 border-accent pl-4 text-left" : "mx-auto",
            config.mobileAlignment === "Center" && "text-center border-0 pl-0",
            config.mobileAlignment === "Right" && "text-right pr-4 border-r-2 border-accent pl-0",
            // Desktop border alignments
            config.desktopAlignment === "Left" ? "lg:border-l-2 lg:border-accent lg:pl-4 lg:text-left lg:border-r-0 lg:pr-0 lg:mx-0" : "",
            config.desktopAlignment === "Center" ? "lg:border-none lg:mx-auto lg:text-center lg:pl-0 lg:pr-0" : "",
            config.desktopAlignment === "Right" ? "lg:border-r-2 lg:border-accent lg:pr-4 lg:text-right lg:border-l-0 lg:pl-0 lg:mx-auto lg:ml-auto lg:mr-0" : ""
          )}
        >
          {config.description}
        </motion.p>
      )}

      <PageHeroButtons config={config} />
    </motion.div>
  );
}
