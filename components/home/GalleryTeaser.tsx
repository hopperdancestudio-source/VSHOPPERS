"use client";

import Link from "next/link";
import type { GalleryItem as GalleryItemType } from "@/lib/types";
import { RevealGroup, revealItem } from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import { GalleryItem } from "@/components/gallery/GalleryItem";

export function GalleryTeaser({ items }: { items: GalleryItemType[] }) {
  return (
    <section id="gallery" className="bg-bg py-section-y-sm md:py-section-y">
      <RevealGroup className="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-1">
        {items.map((item) => (
          <motion.div key={item.id} variants={revealItem} className="group relative aspect-[3/4] overflow-hidden">
            <Link href="/gallery" className="block h-full w-full relative">
              <GalleryItem
                mediaUrl={item.mediaUrl}
                mediaType={item.mediaType}
                hoverImageUrl={item.hoverImageUrl}
                title={item.title}
              />
              {item.title && (
                <span className="absolute bottom-4 left-4 bg-black/80 px-3 py-1.5 font-heading text-sm font-semibold text-ink">
                  {item.title}
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
