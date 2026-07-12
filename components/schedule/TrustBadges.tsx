"use client";

import { PartyPopper, LockOpen, Users, type LucideIcon } from "lucide-react";
import type { TrustBadge } from "@/lib/types";
import { RevealGroup, revealItem } from "@/components/ui/Reveal";
import { motion } from "framer-motion";

const ICONS: Record<string, LucideIcon> = {
  "party-popper": PartyPopper,
  "lock-open": LockOpen,
  users: Users,
};

export function TrustBadges({ badges }: { badges: TrustBadge[] }) {
  return (
    <section className="border-t border-line bg-bg py-10">
      <RevealGroup className="container-base grid grid-cols-1 gap-8 md:grid-cols-3">
        {badges.map((badge) => {
          const Icon = ICONS[badge.icon] ?? Users;
          return (
            <motion.div key={badge.id} variants={revealItem} className="flex items-start gap-4">
              <Icon size={22} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
                  {badge.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{badge.description}</p>
              </div>
            </motion.div>
          );
        })}
      </RevealGroup>
    </section>
  );
}
