"use client";

import { useState, useTransition } from "react";
import type { FieldConfig } from "@/components/admin/SimpleListEditor";
import type { ActionResult } from "@/components/admin/SimpleListEditor";
import { CloudinaryUploadField } from "@/components/admin/CloudinaryUploadField";

const inputClass =
  "w-full border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

export function SingletonForm<T extends object>({
  fields,
  initialData,
  onSave,
}: {
  fields: FieldConfig<T>[];
  initialData: T;
  onSave: (data: T) => Promise<ActionResult>;
}) {
  const [draft, setDraft] = useState<T>(initialData);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    startTransition(async () => {
      const result = await onSave(draft);
      if (result.success) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
        setError(result.error ?? "Failed to save.");
      }
    });
  }

  return (
    <div className="border border-line bg-black/40 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.type === "textarea" || field.type === "media" ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                rows={3}
                value={String(draft[field.name] ?? "")}
                onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value } as T)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            ) : field.type === "checkbox" ? (
              <input
                type="checkbox"
                checked={Boolean(draft[field.name])}
                onChange={(e) => setDraft({ ...draft, [field.name]: e.target.checked } as T)}
                className="h-4 w-4 accent-accent"
              />
            ) : field.type === "media" ? (
              <CloudinaryUploadField
                value={String(draft[field.name] ?? "")}
                onChange={(url) => setDraft({ ...draft, [field.name]: url } as T)}
              />
            ) : (
              <input
                type={field.type === "number" ? "number" : "text"}
                value={String(draft[field.name] ?? "")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value,
                  } as T)
                }
                placeholder={field.placeholder}
                className={inputClass}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button onClick={handleSave} disabled={pending} className="btn-solid !px-6 !py-2.5 text-xs disabled:opacity-60">
          {pending ? "Saving..." : "Save Changes"}
        </button>
        {status === "saved" && <span className="text-xs text-accent">Saved.</span>}
        {status === "error" && <span className="text-xs text-accent">{error}</span>}
      </div>
    </div>
  );
}
