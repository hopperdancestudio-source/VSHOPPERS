"use client";

import clsx from "clsx";
import type { ScheduleSlot } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

const DAYS: ScheduleSlot["day"][] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface ThemeConfig {
  cardBg: string;
  leftBorder: string;
  titleColor: string;
  badgeClass: string;
  legendBg: string;
}

const CATEGORY_THEME: Record<ScheduleSlot["category"], ThemeConfig> = {
  core: {
    cardBg: "bg-bg-raised/40",
    leftBorder: "border-l-2 border-accent",
    titleColor: "text-accent",
    badgeClass: "bg-accent/15 text-accent border border-accent/20",
    legendBg: "bg-accent",
  },
  specialty: {
    cardBg: "bg-bg-raised/40",
    leftBorder: "border-l-2 border-gold",
    titleColor: "text-gold",
    badgeClass: "bg-gold/15 text-gold border border-gold/20",
    legendBg: "bg-gold",
  },
  kids: {
    cardBg: "bg-neutral-900/60",
    leftBorder: "border-l-2 border-neutral-600",
    titleColor: "text-ink",
    badgeClass: "bg-neutral-800 text-neutral-400 border border-neutral-700",
    legendBg: "bg-neutral-500",
  },
};

const LEGEND_ITEMS = [
  { key: "core" as const, label: "Core Class" },
  { key: "specialty" as const, label: "Specialty" },
  { key: "kids" as const, label: "Kids Unit" },
];

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  try {
    const clean = timeStr.trim().toUpperCase();
    const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (!match) return 0;

    let hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const modifier = match[3] || "AM";

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  } catch {
    return 0;
  }
}

export function WeeklyFlowTable({ slots }: { slots: ScheduleSlot[] }) {
  const byDay = DAYS.map((day) => ({
    day,
    slots: slots
      .filter((s) => s.day === day)
      .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)),
  }));

  const maxRows = Math.max(...byDay.map((d) => d.slots.length), 1);

  return (
    <section className="bg-bg py-section-y-sm md:py-section-y">
      <div className="container-base">
        <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-display-md text-ink">Weekly Flow</h2>
          <div className="flex gap-6">
            {LEGEND_ITEMS.map((item) => {
              const theme = CATEGORY_THEME[item.key];
              return (
                <span key={item.label} className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-muted">
                  <span className={clsx("h-2.5 w-2.5 rounded-sm", theme.legendBg)} aria-hidden />
                  {item.label}
                </span>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <div className="overflow-x-auto">
            <div className="grid min-w-[840px] grid-cols-7">
              {byDay.map(({ day }) => (
                <div key={day} className="bg-accent px-4 py-3 font-display text-lg italic text-black">
                  {day}
                </div>
              ))}

              {Array.from({ length: maxRows }).map((_, rowIndex) =>
                byDay.map(({ day, slots: daySlots }) => {
                  const slot = daySlots[rowIndex];
                  const theme = slot ? CATEGORY_THEME[slot.category] : null;
                  return (
                    <div
                      key={`${day}-${rowIndex}`}
                      className={clsx(
                        "min-h-[96px] border-b border-line px-4 py-3 flex flex-col justify-between transition-colors",
                        slot ? clsx(theme?.cardBg, theme?.leftBorder) : "bg-bg-raised/10"
                      )}
                    >
                      {slot && theme && (
                        <>
                          <div>
                            <p className="text-[10px] text-ink-faint tracking-wider mb-0.5">{slot.time}</p>
                            <p className={clsx("font-heading text-sm font-bold uppercase tracking-wide", theme.titleColor)}>
                              {slot.className}
                            </p>
                          </div>
                          <div>
                            <span className={clsx("mt-1.5 inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm", theme.badgeClass)}>
                              {slot.tag || slot.category}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
