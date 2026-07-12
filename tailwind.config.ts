import type { Config } from "tailwindcss";

/**
 * DESIGN TOKENS
 * -------------
 * These values are derived from careful frame-by-frame visual inspection of the
 * reference recording (1920x910 capture, desktop viewport). Where an exact pixel
 * value could not be extracted from a compressed video, the closest sensible value
 * on a consistent 4px-based scale was chosen so the system stays internally
 * proportional. Treat these as a first pass — nudge them once you can compare
 * side-by-side in a browser.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0a0a", // primary near-black background
          raised: "#141414", // card surfaces
          sunken: "#000000", // footer / deepest sections
        },
        ink: {
          DEFAULT: "#f5f3ef", // primary text (off-white, not pure white)
          muted: "#9c9c9c", // secondary/body copy on dark bg
          faint: "#5a5a5a", // tertiary/disabled
        },
        accent: {
          DEFAULT: "#ef4136", // primary red/orange accent (CTAs, highlights)
          dark: "#c9291f", // hover/pressed state
          soft: "#f47a6f", // tints, translucent numerals
        },
        gold: {
          DEFAULT: "#eab308", // secondary accent used for "specialty" tags
        },
        line: {
          DEFAULT: "rgba(255,255,255,0.12)", // hairline borders/dividers on dark bg
        },
      },
      fontFamily: {
        // See TYPOGRAPHY.md for full reasoning.
        display: ["var(--font-display)", "Impact", "sans-serif"], // Anton
        heading: ["var(--font-heading)", "sans-serif"], // Barlow Condensed
        body: ["var(--font-body)", "sans-serif"], // Inter
      },
      fontSize: {
        // Fluid display scale (hero + big section headlines)
        "display-xl": ["clamp(3.5rem, 7vw, 7rem)", { lineHeight: "0.92", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.75rem, 5vw, 4.5rem)", { lineHeight: "0.94", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(2rem, 3.2vw, 3rem)", { lineHeight: "0.98" }],
        "eyebrow": ["0.8125rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      maxWidth: {
        container: "1400px",
      },
      spacing: {
        "section-y": "7rem", // ~112px vertical section padding, desktop
        "section-y-sm": "4rem", // mobile equivalent
        "container-x": "5rem", // ~80px desktop side padding
        "container-x-sm": "1.5rem", // mobile side padding
        "nav-h": "5.5rem", // ~88px navbar height
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "0px", // reference uses hard, squared corners throughout
        sm: "2px",
      },
      transitionTimingFunction: {
        reveal: "cubic-bezier(0.16, 1, 0.3, 1)", // easeOutExpo-ish, used for all scroll reveals
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
