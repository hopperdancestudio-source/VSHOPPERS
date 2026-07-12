"use client";

import { motion } from "framer-motion";
import type { GalleryItem as GalleryItemType } from "@/lib/types";
import { RevealGroup, revealItem } from "@/components/ui/Reveal";
import { GalleryItem } from "@/components/gallery/GalleryItem";

export function TeamGallery({ photos }: { photos: GalleryItemType[] }) {
  return (
    <section className="bg-bg py-section-y-sm md:py-section-y">
      <div className="container-base">
        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {photos.map((photo) => (
            <motion.div key={photo.id} variants={revealItem} className="aspect-[4/3] bg-bg-raised relative">
              <GalleryItem
                mediaUrl={photo.mediaUrl}
                mediaType={photo.mediaType}
                title={photo.title}
                grayscale={true}
              />
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
