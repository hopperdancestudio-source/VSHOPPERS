"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";

interface CTABannerProps {
  watermarkWord: string;
  heading: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  contactRow?: { label: string; value: string }[];
}

export function CTABanner({
  watermarkWord,
  heading,
  primaryCta,
  secondaryCta,
  contactRow,
}: CTABannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Subtle parallax drift on the giant background word
  const x = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-accent py-28">
      <motion.div
        style={{ x }}
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span className="whitespace-nowrap font-display text-[18vw] leading-none text-black/15">
          {watermarkWord}
        </span>
      </motion.div>

      <Reveal className="container-base relative flex flex-col items-center gap-8 text-center">
        <h2 className="font-display text-display-xl text-black">{heading}</h2>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href={primaryCta.href} className="btn-dark">
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="btn border border-black text-black hover:bg-black hover:text-white"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>

        {contactRow && (
          <div className="mt-4 flex flex-col gap-3 text-sm font-semibold uppercase tracking-wide text-black sm:flex-row sm:gap-10">
            {contactRow.map((item) => (
              <span key={item.label}>{item.value}</span>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
