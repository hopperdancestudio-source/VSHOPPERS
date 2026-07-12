"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { ScheduleSlot } from "@/lib/types";
import type { ActionResult } from "@/components/admin/SimpleListEditor";

const inputClass =
  "w-full border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";
const DAYS: ScheduleSlot["day"][] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const CATEGORIES: ScheduleSlot["category"][] = ["core", "specialty", "kids"];

const DAYS_ORDER: Record<string, number> = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 };

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

type Draft = Omit<ScheduleSlot, "id"> & { id?: string };

function toDraft(item?: ScheduleSlot): Draft {
  return {
    day: item?.day ?? "MON",
    time: item?.time ?? "",
    className: item?.className ?? "",
    category: item?.category ?? "core",
    tag: item?.tag ?? "",
    id: item?.id,
  };
}

export function ScheduleSlotsEditor({
  items,
  onCreate,
  onUpdate,
  onDelete,
}: {
  items: ScheduleSlot[];
  onCreate: (data: Omit<ScheduleSlot, "id">) => Promise<ActionResult>;
  onUpdate: (id: string, data: Omit<ScheduleSlot, "id">) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(toDraft());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    startTransition(async () => {
      const rest = { ...draft };
      delete (rest as { id?: string }).id;
      const result = editingId ? await onUpdate(editingId, rest) : await onCreate(rest);
      if (result.success) {
        setEditingId(null);
        setAdding(false);
        setDraft(toDraft());
      } else {
        setError(result.error ?? "Failed to save.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-accent">{error}</p>}

      {adding && (
        <div className="border border-accent/40 bg-black/40 p-4 mb-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <select
              value={draft.day}
              onChange={(e) => setDraft({ ...draft, day: e.target.value as ScheduleSlot["day"] })}
              className={inputClass}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              value={draft.time}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              placeholder="07:00 AM"
              className={inputClass}
            />
            <input
              value={draft.className}
              onChange={(e) => setDraft({ ...draft, className: e.target.value })}
              placeholder="Class name"
              className={inputClass}
            />
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as ScheduleSlot["category"] })}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              value={draft.tag ?? ""}
              onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
              placeholder="Tag (optional)"
              className={inputClass}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={save} disabled={pending} className="btn-solid !px-4 !py-2 text-xs">
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
              }}
              className="btn border border-white/20 !px-4 !py-2 text-xs text-ink-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!editingId && !adding && (
        <button
          onClick={() => {
            setAdding(true);
            setDraft(toDraft());
          }}
          className="flex items-center justify-center gap-2 border border-dashed border-white/20 py-3 text-sm text-ink-muted hover:border-accent hover:text-accent mb-2"
        >
          <Plus size={16} /> Add Schedule Slot
        </button>
      )}

      {editingId && (
        <div className="border border-accent/40 bg-black/40 p-4 mb-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">Edit Schedule Slot</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <select
              value={draft.day}
              onChange={(e) => setDraft({ ...draft, day: e.target.value as ScheduleSlot["day"] })}
              className={inputClass}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              value={draft.time}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              placeholder="07:00 AM"
              className={inputClass}
            />
            <input
              value={draft.className}
              onChange={(e) => setDraft({ ...draft, className: e.target.value })}
              placeholder="Class name"
              className={inputClass}
            />
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as ScheduleSlot["category"] })}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              value={draft.tag ?? ""}
              onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
              placeholder="Tag (optional)"
              className={inputClass}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={save} disabled={pending} className="btn-solid !px-4 !py-2 text-xs">
              Save
            </button>
            <button
              onClick={() => {
                setEditingId(null);
              }}
              className="btn border border-white/20 !px-4 !py-2 text-xs text-ink-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/20 py-10 px-4 text-center rounded">
          <p className="text-sm font-semibold text-ink-muted">No schedule slots configured yet</p>
          <p className="text-xs text-ink-faint mt-1 mb-4">Add your first slot using the button above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
                <th className="py-2">Day</th>
                <th>Time</th>
                <th>Class</th>
                <th>Category</th>
                <th>Tag</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...items]
                .sort((a, b) => {
                  const dayDiff = (DAYS_ORDER[a.day] ?? 0) - (DAYS_ORDER[b.day] ?? 0);
                  if (dayDiff !== 0) return dayDiff;
                  return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
                })
                .map((item) => (
                  <tr key={item.id} className="border-b border-line/50 align-top">
                    <td className="py-2 text-ink">{item.day}</td>
                    <td className="text-ink-muted">{item.time}</td>
                    <td className="text-ink">{item.className}</td>
                    <td className="text-ink-muted">{item.category}</td>
                    <td className="text-ink-muted">{item.tag ?? "—"}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setDraft(toDraft(item));
                            setAdding(false);
                          }}
                          className="text-ink-muted hover:text-accent"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => confirm("Delete this slot?") && onDelete(item.id)}
                          className="text-ink-muted hover:text-accent"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
