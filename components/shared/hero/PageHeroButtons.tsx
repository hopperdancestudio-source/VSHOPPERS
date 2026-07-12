"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { heroWordReveal } from "@/lib/motion";
import type { PageHeroConfig } from "@/lib/types";

export function PageHeroButtons({ config }: { config: PageHeroConfig }) {
  const hasPrimary = !!(config.primaryButtonText && config.primaryButtonUrl);
  const hasSecondary = !!(config.secondaryButtonText && config.secondaryButtonUrl);

  if (!hasPrimary && !hasSecondary) return null;

  function renderButton(text: string, url: string, isPrimary: boolean) {
    const isExternal = url.startsWith("http://") || url.startsWith("https://");
    const className = isPrimary ? "btn-solid" : "btn-outline";

    if (isExternal) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {text}
        </a>
      );
    }

    return (
      <Link href={url} className={className}>
        {text}
      </Link>
    );
  }

  return (
    <motion.div
      variants={heroWordReveal}
      className="mt-10 flex flex-wrap gap-4 justify-inherit"
    >
      {hasPrimary && renderButton(config.primaryButtonText, config.primaryButtonUrl, true)}
      {hasSecondary && renderButton(config.secondaryButtonText, config.secondaryButtonUrl, false)}
    </motion.div>
  );
}
