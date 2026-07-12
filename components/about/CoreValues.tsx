"use client";

import { motion } from "framer-motion";
import type { CoreValue } from "@/lib/types";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";

export function CoreValues({ values }: { values: CoreValue[] }) {
  return (
    <section className="bg-bg py-section-y-sm md:py-section-y">
      <div className="container-base">
        <Reveal className="mb-14 text-center">
          <h2 className="font-display text-display-md text-ink">Core Values</h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 md:grid-cols-4">
          {values.map((value) => (
            <motion.div key={value.id} variants={revealItem} className="bg-bg px-6 py-8">
              <span className="font-heading text-sm font-bold text-accent">{value.index}</span>
              <h3 className="mt-2 font-display text-2xl text-ink">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{value.description}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
