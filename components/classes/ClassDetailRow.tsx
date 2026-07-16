"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ClassStyle } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { LevelBadge } from "@/components/shared/LevelBadge";
import { GalleryItem } from "@/components/gallery/GalleryItem";

export function ClassDetailRow({ item }: { item: ClassStyle }) {
  const reversed = item.order % 2 === 0; // alternate image L/R per row

  return (
    <div className="border-t border-line py-16 first:border-t-0 first:pt-0 md:py-24">
      <div
        className={`container-base grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 ${
          reversed ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal className="group relative aspect-[4/3] w-full bg-bg-raised">
          <GalleryItem
            mediaUrl={item.mediaUrl}
            mediaType={item.mediaType}
            hoverImageUrl={item.secondaryImageUrl}
            title={item.name}
            grayscale={false}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <span className="font-display text-6xl text-accent/30">
            {String(item.order).padStart(2, "0")}
          </span>
          <h3 className="font-display text-display-md text-ink">{item.name}</h3>
          <p className="mt-4 max-w-md font-body text-base leading-relaxed text-ink-muted">
            {item.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {item.levels.map((level) => (
              <LevelBadge key={level}>{level}</LevelBadge>
            ))}
          </div>

          <Link
            href="/register"
            className="group mt-8 inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-accent"
          >
            REGISTER NOW
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
