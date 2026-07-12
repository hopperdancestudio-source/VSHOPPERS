"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { AgeBatch } from "@/lib/types";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";

export function BatchesSection({ batches }: { batches: AgeBatch[] }) {
  return (
    <section className="bg-bg-raised/40 py-section-y-sm md:py-section-y">
      <div className="container-base">
        <Reveal className="mb-14 text-center">
          <h2 className="font-display text-display-lg text-ink">Groups for Every Level</h2>
          <span className="mx-auto mt-4 block h-[3px] w-16 bg-accent" />
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {batches.map((batch) => (
            <motion.div
              key={batch.id}
              variants={revealItem}
              className="border-t-2 border-accent bg-bg px-8 py-12 text-center transition-transform duration-300 ease-reveal hover:-translate-y-1"
            >
              <h3 className="font-display text-4xl text-ink">{batch.name}</h3>
              <p className="mt-3 font-heading text-sm font-semibold uppercase tracking-wider text-accent">
                {batch.ageRange}
              </p>
              <p className="mx-auto mt-4 max-w-[26ch] font-body text-sm leading-relaxed text-ink-muted">
                {batch.description}
              </p>
              <Link href="/schedule" className="btn-outline-accent mt-8 !px-6 !py-3 text-xs">
                View Schedule
              </Link>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
