import type { Variants } from "framer-motion";

/**
 * Motion tokens
 * -------------
 * duration/easing/stagger values chosen to match the character of the reference's
 * scroll reveals and hero load-in: quick-ish, slightly decelerated, staggered by
 * ~80-120ms per sibling. Centralized here so every section reads consistently.
 */
export const EASE_REVEAL = [0.16, 1, 0.3, 1] as const; // easeOutExpo-like
export const DURATION_REVEAL = 0.7;
export const STAGGER_CHILD = 0.1;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_REVEAL, ease: EASE_REVEAL },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: STAGGER_CHILD,
      delayChildren: 0.05,
    },
  },
};

export const heroWordReveal: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_REVEAL },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION_REVEAL, ease: EASE_REVEAL },
  },
};

// Standard viewport config for scroll-triggered reveals across the site
export const revealViewport = { once: true, margin: "-80px 0px -80px 0px" };
