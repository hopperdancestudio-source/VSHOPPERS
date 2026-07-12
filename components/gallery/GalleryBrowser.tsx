"use client";

import { useMemo, useState } from "react";
import { FilterTabs } from "@/components/gallery/FilterTabs";
import { MasonryGrid } from "@/components/gallery/MasonryGrid";
import type { GalleryItem } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

export function GalleryBrowser({
  items,
  filters,
}: {
  items: GalleryItem[];
  filters: string[];
}) {
  const [active, setActive] = useState("ALL");

  const visible = useMemo(
    () => (active === "ALL" ? items : items.filter((i) => i.category === active)),
    [items, active]
  );

  return (
    <section className="bg-bg pb-section-y-sm md:pb-section-y">
      <div className="container-base">
        <Reveal className="mb-10">
          <FilterTabs filters={filters} active={active} onChange={setActive} />
        </Reveal>
        <MasonryGrid items={visible} />
      </div>
    </section>
  );
}
