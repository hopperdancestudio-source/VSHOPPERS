"use client";

import clsx from "clsx";

export function FilterTabs({
  filters,
  active,
  onChange,
}: {
  filters: string[];
  active: string;
  onChange: (filter: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={clsx(
            "border px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wide transition-colors duration-200",
            active === filter
              ? "border-accent bg-accent text-white"
              : "border-white/25 text-ink-muted hover:border-white/50 hover:text-ink"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
