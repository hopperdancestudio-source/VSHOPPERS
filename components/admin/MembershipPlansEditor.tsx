"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { MembershipPlan, MembershipPlanDb } from "@/lib/types";
import type { ActionResult } from "@/components/admin/SimpleListEditor";

const inputClass =
  "w-full border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

type Draft = Omit<MembershipPlan, "id" | "features" | "order"> & {
  id?: string;
  featuresText: string;
  sortOrder: number;
};

// Stored as one feature per line: "Label" or "Label|no" to mark it excluded.
function featuresToText(features: MembershipPlan["features"]): string {
  return features.map((f) => (f.included ? f.label : `${f.label}|no`)).join("\n");
}
function textToFeatures(text: string): MembershipPlan["features"] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, flag] = line.split("|");
      return { label: label!.trim(), included: flag?.trim() !== "no" };
    });
}

function toDraft(item?: MembershipPlan): Draft {
  return {
    sortOrder: item?.order ?? 1,
    name: item?.name ?? "",
    price: item?.price ?? "",
    period: item?.period ?? "",
    featuresText: item ? featuresToText(item.features) : "",
    highlighted: item?.highlighted ?? false,
    ctaLabel: item?.ctaLabel ?? "Join Now",
    id: item?.id,
  };
}

export function MembershipPlansEditor({
  items,
  onCreate,
  onUpdate,
  onDelete,
}: {
  items: MembershipPlan[];
  onCreate: (data: Omit<MembershipPlanDb, "id">) => Promise<ActionResult>;
  onUpdate: (id: string, data: Omit<MembershipPlanDb, "id">) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(toDraft());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function payload(d: Draft) {
    return {
      sortOrder: d.sortOrder,
      name: d.name,
      price: d.price,
      period: d.period,
      features: textToFeatures(d.featuresText),
      highlighted: d.highlighted,
      ctaLabel: d.ctaLabel,
    };
  }

  function save() {
    startTransition(async () => {
      const result = editingId
        ? await onUpdate(editingId, payload(draft))
        : await onCreate(payload(draft));
      if (result.success) {
        setEditingId(null);
        setAdding(false);
        setDraft(toDraft());
      } else {
        setError(result.error ?? "Failed to save.");
      }
    });
  }

  const Form = (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <input
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        placeholder="Plan name"
        className={inputClass}
      />
      <div className="flex gap-2">
        <input
          value={draft.price}
          onChange={(e) => setDraft({ ...draft, price: e.target.value })}
          placeholder="$140"
          className={inputClass}
        />
        <input
          value={draft.period}
          onChange={(e) => setDraft({ ...draft, period: e.target.value })}
          placeholder="/ MO"
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">
          Features (one per line — add &quot;|no&quot; to mark as excluded)
        </label>
        <textarea
          rows={4}
          value={draft.featuresText}
          onChange={(e) => setDraft({ ...draft, featuresText: e.target.value })}
          className={inputClass}
        />
      </div>
      <input
        value={draft.ctaLabel}
        onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })}
        placeholder="Button label"
        className={inputClass}
      />
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={draft.highlighted}
          onChange={(e) => setDraft({ ...draft, highlighted: e.target.checked })}
          className="h-4 w-4 accent-accent"
        />
        Highlight as &quot;Most Popular&quot;
      </label>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-accent">{error}</p>}

      {adding ? (
        <div className="border border-accent/40 bg-black/40 p-4 mb-2">
          {Form}
          <div className="mt-3 flex gap-2">
            <button onClick={save} disabled={pending} className="btn-solid !px-4 !py-2 text-xs">
              Add
            </button>
            <button onClick={() => setAdding(false)} className="btn border border-white/20 !px-4 !py-2 text-xs text-ink-muted">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        !editingId && (
          <button
            onClick={() => {
              setAdding(true);
              setDraft(toDraft());
            }}
            className="flex items-center justify-center gap-2 border border-dashed border-white/20 py-3 text-sm text-ink-muted hover:border-accent hover:text-accent mb-2"
          >
            <Plus size={16} /> Add Plan
          </button>
        )
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/20 py-10 px-4 text-center rounded">
          <p className="text-sm font-semibold text-ink-muted">No plans configured yet</p>
          <p className="text-xs text-ink-faint mt-1 mb-4">Add your first pricing plan using the button above.</p>
        </div>
      ) : (
        [...items]
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <div key={item.id} className="border border-line bg-black/40 p-4">
              {editingId === item.id ? (
                Form
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-heading text-sm font-bold uppercase text-ink">
                      {item.name} — {item.price}
                      {item.period} {item.highlighted && <span className="text-accent">★</span>}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">{item.features.length} features</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setDraft(toDraft(item));
                        setAdding(false);
                      }}
                      className="text-ink-muted hover:text-accent"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => confirm("Delete this plan?") && onDelete(item.id)}
                      className="text-ink-muted hover:text-accent"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
              {editingId === item.id && (
                <div className="mt-3 flex gap-2">
                  <button onClick={save} disabled={pending} className="btn-solid !px-4 !py-2 text-xs">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="btn border border-white/20 !px-4 !py-2 text-xs text-ink-muted">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
      )}
    </div>
  );
}
