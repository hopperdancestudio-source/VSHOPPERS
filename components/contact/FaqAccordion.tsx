"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import clsx from "clsx";

export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className={clsx("bg-bg py-section-y-sm md:py-section-y", className)}>
      <div className="container-base max-w-2xl">
        <Reveal className="mb-10">
          <h2 className="font-display text-display-md text-ink">FAQ</h2>
        </Reveal>

        <div className="flex flex-col">
          {[...items]
            .sort((a, b) => a.order - b.order)
            .map((item) => {
              const open = openId === item.id;
              return (
                <div key={item.id} className="border-b border-line">
                  <button
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex w-full items-center justify-between py-6 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-heading text-base font-semibold uppercase tracking-wide text-ink">
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: open ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="shrink-0 text-accent"
                    >
                      <Plus size={20} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
