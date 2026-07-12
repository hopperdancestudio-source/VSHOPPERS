"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { PageHeroConfig } from "@/lib/types";
import { PageHeroBackground } from "./PageHeroBackground";
import { PageHeroOverlay } from "./PageHeroOverlay";
import { PageHeroContent } from "./PageHeroContent";

const VERTICAL_CLASSES = {
  Top: "items-start pt-36 pb-20",
  Center: "items-center py-20",
  Bottom: "items-end pt-20 pb-32",
};

export function PageHero({ config }: { config: PageHeroConfig }) {
  const heightStyle = config.heroHeight.includes("vh") || config.heroHeight.includes("px")
    ? { minHeight: config.heroHeight }
    : {};

  return (
    <section
      className={clsx(
        "relative flex overflow-hidden bg-bg pt-nav-h",
        VERTICAL_CLASSES[config.verticalAlignment],
        !heightStyle.minHeight && config.heroHeight
      )}
      style={heightStyle}
    >
      {/* Background Loader */}
      <PageHeroBackground config={config} />

      {/* Overlays & Gradients */}
      <PageHeroOverlay config={config} />

      {/* Content Block */}
      <div className="container-base relative z-10 w-full flex">
        <PageHeroContent config={config} />
      </div>

      {/* Scroll Indicator */}
      {config.showScrollIndicator && (
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 right-8 z-10 text-accent md:right-16"
          aria-hidden
        >
          <ChevronDown size={28} />
        </motion.div>
      )}
    </section>
  );
}
