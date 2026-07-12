"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "media";

export interface FieldConfig<T = Record<string, unknown>> {
  name: Extract<keyof T, string>;
  label: string;
  type: FieldType;
  placeholder?: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

interface SimpleListEditorProps<T extends { id: string }> {
  fields: FieldConfig<Omit<T, "id">>[];
  items: T[];
  emptyItem: Omit<T, "id">;
  onCreate: (data: Omit<T, "id">) => Promise<ActionResult>;
  onUpdate: (id: string, data: Omit<T, "id">) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
}

const inputClass =
  "w-full border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

function FieldInput<T extends object>({
  field,
  value,
  onChange,
}: {
  field: FieldConfig<T>;
  value: unknown;
  onChange: (v: T[Extract<keyof T, string>]) => void;
}) {
  if (field.type === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked as unknown as T[Extract<keyof T, string>])}
        className="h-4 w-4 accent-accent"
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea
        rows={2}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value as unknown as T[Extract<keyof T, string>])}
        placeholder={field.placeholder}
        className={inputClass}
      />
    );
  }
  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      value={String(value ?? "")}
      onChange={(e) =>
        onChange(
          (field.type === "number" ? Number(e.target.value) : e.target.value) as unknown as T[Extract<keyof T, string>]
        )
      }
      placeholder={field.placeholder}
      className={inputClass}
    />
  );
}

export function SimpleListEditor<T extends { id: string }>({
  fields,
  items,
  emptyItem,
  onCreate,
  onUpdate,
  onDelete,
}: SimpleListEditorProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<T, "id">>(emptyItem);
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function startEdit(item: T) {
    setEditingId(item.id);
    setDraft(item);
    setAdding(false);
  }

  function cancel() {
    setEditingId(null);
    setAdding(false);
    setDraft(emptyItem);
    setError(null);
  }

  function saveEdit() {
    if (!editingId) return;
    startTransition(async () => {
      const result = await onUpdate(editingId, draft);
      if (result.success) cancel();
      else setError(result.error ?? "Failed to save.");
    });
  }

  function saveNew() {
    startTransition(async () => {
      const result = await onCreate(draft);
      if (result.success) cancel();
      else setError(result.error ?? "Failed to create.");
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    startTransition(async () => {
      await onDelete(id);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-accent">{error}</p>}

      {adding ? (
        <div className="border border-accent/40 bg-black/40 p-4 mb-2">
          <EditForm fields={fields} draft={draft} setDraft={setDraft} />
          <div className="mt-3 flex gap-2">
            <button onClick={saveNew} disabled={pending} className="btn-solid !px-4 !py-2 text-xs">
              Add
            </button>
            <button onClick={cancel} className="btn border border-white/20 !px-4 !py-2 text-xs text-ink-muted">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setAdding(true);
            setDraft(emptyItem);
            setEditingId(null);
          }}
          className={clsx(
            "flex items-center justify-center gap-2 border border-dashed border-white/20 py-3 text-sm text-ink-muted hover:border-accent hover:text-accent mb-2"
          )}
        >
          <Plus size={16} /> Add Item
        </button>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/20 py-10 px-4 text-center rounded">
          <p className="text-sm font-semibold text-ink-muted">No items configured yet</p>
          <p className="text-xs text-ink-faint mt-1 mb-4">Add your first record using the button above.</p>
        </div>
      ) : (
        items.map((item) => {
          const isEditing = editingId === item.id;
          return (
            <div key={item.id} className="border border-line bg-black/40 p-4">
              {isEditing ? (
                <EditForm fields={fields} draft={draft} setDraft={setDraft} />
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-muted">
                    {fields.map((f) => (
                      <span key={f.name}>
                        <span className="text-ink-faint">{f.label}: </span>
                        <span className="text-ink">
                          {f.type === "checkbox" ? (item[f.name as unknown as keyof T] ? "Yes" : "No") : String(item[f.name as unknown as keyof T] ?? "—")}
                        </span>
                      </span>
                    ))}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => startEdit(item)} className="text-ink-muted hover:text-accent">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(item.id)} className="text-ink-muted hover:text-accent">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="mt-3 flex gap-2">
                  <button onClick={saveEdit} disabled={pending} className="btn-solid !px-4 !py-2 text-xs">
                    Save
                  </button>
                  <button onClick={cancel} className="btn border border-white/20 !px-4 !py-2 text-xs text-ink-muted">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function EditForm<T extends object>({
  fields,
  draft,
  setDraft,
}: {
  fields: FieldConfig<T>[];
  draft: T;
  setDraft: (d: T) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
          <label className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-ink-faint">
            {f.label}
            {f.type === "checkbox" && (
              <FieldInput field={f} value={draft[f.name]} onChange={(v) => setDraft({ ...draft, [f.name]: v } as T)} />
            )}
          </label>
          {f.type !== "checkbox" && (
            <FieldInput field={f} value={draft[f.name]} onChange={(v) => setDraft({ ...draft, [f.name]: v } as T)} />
          )}
        </div>
      ))}
    </div>
  );
}

export function AdminSectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
