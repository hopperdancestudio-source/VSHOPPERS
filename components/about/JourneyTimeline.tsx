"use client";

import { motion } from "framer-motion";
import type { JourneyMilestone } from "@/lib/types";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";

export function JourneyTimeline({ milestones }: { milestones: JourneyMilestone[] }) {
  const sorted = [...milestones].sort((a, b) => a.order - b.order);

  return (
    <section className="bg-bg-raised/30 py-section-y-sm md:py-section-y">
      <div className="container-base">
        <Reveal className="mb-14">
          <h2 className="font-display text-display-md text-ink">Our Journey</h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-5">
          {sorted.map((m) => (
            <motion.div key={m.id} variants={revealItem} className="relative border-t-2 border-accent pt-5">
              <span className="absolute -top-[5px] left-0 h-2 w-2 bg-accent" aria-hidden />
              <p className="font-display text-2xl text-accent">{m.year}</p>
              <p className="mt-1 font-heading text-xs font-bold uppercase tracking-wide text-ink">
                {m.title}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">{m.description}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
