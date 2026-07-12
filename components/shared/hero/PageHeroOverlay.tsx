"use client";

import type { PageHeroConfig } from "@/lib/types";

export function PageHeroOverlay({ config }: { config: PageHeroConfig }) {
  let style: React.CSSProperties = {};

  if (config.gradientType === "Solid") {
    style = {
      backgroundColor: config.overlayColor,
      opacity: config.overlayOpacity,
    };
  } else if (config.gradientType === "Linear") {
    style = {
      background: `linear-gradient(135deg, ${config.overlayColor}cc, #000000ef)`,
      opacity: config.overlayOpacity,
    };
  } else if (config.gradientType === "Radial") {
    style = {
      background: `radial-gradient(circle at center, ${config.overlayColor}bb, #000000fc)`,
      opacity: config.overlayOpacity,
    };
  } else {
    return null;
  }

  return (
    <div
      className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
      style={style}
    />
  );
}
