"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { HeroStat } from "@/lib/types";

function CountUpValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  // Parse a leading numeric portion (handles "2000+", "4.9", "50+") and animate it;
  // any non-numeric suffix (+, K, etc.) is preserved and appended at the end.
  useEffect(() => {
    if (!inView) return;
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match || !match[1] || match[2] === undefined) {
      setDisplay(value);
      return;
    }
    const numStr = match[1];
    const suffix = match[2];
    const target = parseFloat(numStr);
    const isDecimal = numStr.includes(".");
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay((isDecimal ? current.toFixed(1) : Math.round(current).toString()) + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

export function StatsBar({ stats }: { stats: HeroStat[] }) {
  return (
    <section className="border-y border-line bg-bg-raised/30">
      <div className="container-base grid grid-cols-2 divide-y divide-line md:grid-cols-4 md:divide-x md:divide-y-0">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="px-6 py-10 text-center"
          >
            <p className="font-display text-4xl text-ink md:text-5xl">
              <CountUpValue value={stat.value} />
            </p>
            <p className="mt-2 font-heading text-xs uppercase tracking-wider text-ink-muted">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
