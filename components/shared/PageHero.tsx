"use client";

import { PageHero as NewPageHero } from "./hero/PageHero";
import type { PageHeroConfig } from "@/lib/types";

interface PageHeroProps {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  accentLine?: 1 | 2;
  description?: string;
  backgroundMediaUrl?: string;
  showScrollArrow?: boolean;
  align?: "left" | "center";
}

export function PageHero({
  eyebrow,
  headlineLine1,
  headlineLine2,
  description,
  backgroundMediaUrl,
  showScrollArrow = false,
  align = "left",
}: PageHeroProps) {
  const mockConfig: PageHeroConfig = {
    pageKey: "legacy",
    eyebrow,
    titleLine1: headlineLine1,
    titleLine2: headlineLine2,
    description: description ?? "",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    desktopImageUrl: backgroundMediaUrl ?? "",
    desktopVideoUrl: "",
    desktopVideoPoster: "",
    mobileImageUrl: backgroundMediaUrl ?? "",
    mobileVideoUrl: "",
    mobileVideoPoster: "",
    heroHeight: "min-h-[70vh]",
    contentWidth: "Large",
    desktopAlignment: align === "center" ? "Center" : "Left",
    mobileAlignment: align === "center" ? "Center" : "Left",
    verticalAlignment: "Center",
    overlayColor: "#000000",
    overlayOpacity: 0.4,
    gradientType: "Linear",
    backgroundPosition: "center",
    revealAnimation: "Reveal",
    showScrollIndicator: showScrollArrow,
  };

  return <NewPageHero config={mockConfig} />;
}
