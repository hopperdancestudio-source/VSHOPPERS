"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import clsx from "clsx";
import type { MembershipPlan } from "@/lib/types";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";

export function MembershipPricing({ plans }: { plans: MembershipPlan[] }) {
  return (
    <section className="bg-bg-raised/30 py-section-y-sm md:py-section-y">
      <div className="container-base">
        <Reveal className="mb-14 text-center">
          <h2 className="font-display text-display-md text-ink">Memberships</h2>
          <p className="eyebrow mt-3">Invest in Your Movement</p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
          {[...plans]
            .sort((a, b) => a.order - b.order)
            .map((plan) => (
              <motion.div
                key={plan.id}
                variants={revealItem}
                className={clsx(
                  "relative flex flex-col border bg-bg px-8 py-10",
                  plan.highlighted ? "border-accent md:-translate-y-4" : "border-line"
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent px-4 py-1 font-heading text-xs font-bold uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                )}

                <h3 className="font-display text-3xl text-ink">{plan.name}</h3>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl text-accent">{plan.price}</span>
                  <span className="font-heading text-sm text-ink-muted">{plan.period}</span>
                </p>

                <ul className="mt-8 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-3 text-sm text-ink-muted">
                      {f.included ? (
                        <Check size={16} className="shrink-0 text-accent" />
                      ) : (
                        <X size={16} className="shrink-0 text-ink-faint" />
                      )}
                      <span className={f.included ? "text-ink" : "text-ink-faint line-through"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={clsx(
                    "mt-10 text-center font-heading text-xs font-semibold uppercase tracking-wider",
                    plan.highlighted ? "btn-solid" : "btn border border-white/30 text-ink hover:border-accent hover:text-accent"
                  )}
                >
                  REGISTER NOW
                </Link>
              </motion.div>
            ))}
        </RevealGroup>
      </div>
    </section>
  );
}
