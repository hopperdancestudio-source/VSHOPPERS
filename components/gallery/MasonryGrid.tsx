"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { GalleryItem as GalleryItemType } from "@/lib/types";
import { GalleryItem } from "./GalleryItem";

export function MasonryGrid({ items }: { items: GalleryItemType[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="group relative aspect-square overflow-hidden bg-bg-raised"
          >
            <GalleryItem
              mediaUrl={item.mediaUrl}
              mediaType={item.mediaType}
              hoverImageUrl={item.hoverImageUrl}
              title={item.title}
            />

            {item.title && (
              <span className="absolute bottom-3 left-3 bg-black/80 px-3 py-1.5 font-heading text-xs font-semibold uppercase tracking-wide text-ink">
                {item.title}
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
