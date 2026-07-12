"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import clsx from "clsx";
import type { PageHeroConfig, HeroStat } from "@/lib/types";
import { heroWordReveal, staggerContainer } from "@/lib/motion";
import { PageHeroBackground } from "@/components/shared/hero/PageHeroBackground";
import { PageHeroOverlay } from "@/components/shared/hero/PageHeroOverlay";

const VERTICAL_CLASSES = {
  Top: "items-start pt-36 pb-20",
  Center: "items-center py-20",
  Bottom: "items-end pt-20 pb-24",
};

const WIDTH_CLASSES = {
  Small: "max-w-md",
  Medium: "max-w-2xl",
  Large: "max-w-4xl",
  Full: "max-w-none",
};

export function Hero({ config, stats }: { config: PageHeroConfig; stats: HeroStat[] }) {
  const heightStyle = config.heroHeight.includes("vh") || config.heroHeight.includes("px")
    ? { minHeight: config.heroHeight }
    : {};

  const hasPrimary = !!(config.primaryButtonText && config.primaryButtonUrl);
  const hasSecondary = !!(config.secondaryButtonText && config.secondaryButtonUrl);

  return (
    <section
      className={clsx(
        "relative flex overflow-hidden bg-bg pt-nav-h",
        VERTICAL_CLASSES[config.verticalAlignment],
        !heightStyle.minHeight && config.heroHeight
      )}
      style={heightStyle}
    >
      {/* Background Media */}
      <PageHeroBackground config={config} />

      {/* Overlay Effects */}
      <PageHeroOverlay config={config} />

      {/* Content Container */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className={clsx(
          "container-base relative z-10 w-full flex flex-col transition-all duration-300",
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
          <motion.p variants={heroWordReveal} className="eyebrow mb-6">
            {config.eyebrow}
          </motion.p>
        )}

        <h1 className="font-display text-display-xl text-ink uppercase">
          {config.titleLine1 && (
            <motion.span variants={heroWordReveal} className="block text-ink">
              {config.titleLine1}
            </motion.span>
          )}
          {config.titleLine2 && (
            <motion.span variants={heroWordReveal} className="block text-accent">
              {config.titleLine2}
            </motion.span>
          )}
        </h1>

        {config.description && (
          <motion.p
            variants={heroWordReveal}
            className={clsx(
              "mt-6 max-w-md font-body text-base leading-relaxed text-ink-muted transition-all",
              config.mobileAlignment === "Left" ? "border-l-2 border-accent pl-4 text-left" : "mx-auto",
              config.mobileAlignment === "Center" && "text-center border-0 pl-0",
              config.mobileAlignment === "Right" && "text-right pr-4 border-r-2 border-accent pl-0",
              config.desktopAlignment === "Left" ? "lg:border-l-2 lg:border-accent lg:pl-4 lg:text-left lg:border-r-0 lg:pr-0 lg:mx-0" : "",
              config.desktopAlignment === "Center" ? "lg:border-none lg:mx-auto lg:text-center lg:pl-0 lg:pr-0" : "",
              config.desktopAlignment === "Right" ? "lg:border-r-2 lg:border-accent lg:pr-4 lg:text-right lg:border-l-0 lg:pl-0 lg:mx-auto lg:ml-auto lg:mr-0" : ""
            )}
          >
            {config.description}
          </motion.p>
        )}

        <motion.div variants={heroWordReveal} className="mt-8 flex flex-wrap gap-4 justify-inherit">
          {hasPrimary && (
            <Link href={config.primaryButtonUrl} className="btn-solid">
              {config.primaryButtonText}
            </Link>
          )}
          {hasSecondary && (
            <Link href={config.secondaryButtonUrl} className="btn-outline gap-2">
              {config.secondaryButtonText} <Play size={16} />
            </Link>
          )}
        </motion.div>

        {stats.length > 0 && (
          <motion.div
            variants={heroWordReveal}
            className="mt-14 flex flex-wrap gap-10 border-t border-line pt-8 w-full justify-inherit"
          >
            {stats.map((stat) => (
              <div key={stat.id} className="text-left">
                <p className="font-display text-3xl text-gold">{stat.value}</p>
                <p className="font-heading text-xs uppercase tracking-wider text-ink-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
