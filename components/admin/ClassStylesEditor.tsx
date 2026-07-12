"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { ClassStyle, ClassStyleDb } from "@/lib/types";
import type { ActionResult } from "@/components/admin/SimpleListEditor";
import { CloudinaryUploadField } from "@/components/admin/CloudinaryUploadField";
import { GalleryItem } from "@/components/gallery/GalleryItem";

const inputClass =
  "w-full border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

type Draft = Omit<ClassStyle, "id" | "levels" | "order"> & {
  id?: string;
  levelsCsv: string;
  sortOrder: number;
};

function toDraft(item?: ClassStyle): Draft {
  return {
    sortOrder: item?.order ?? 1,
    name: item?.name ?? "",
    description: item?.description ?? "",
    levelsCsv: item?.levels.join(", ") ?? "",
    mediaUrl: item?.mediaUrl ?? "",
    mediaType: item?.mediaType ?? "image",
    secondaryImageUrl: item?.secondaryImageUrl ?? null,
    id: item?.id,
  };
}

export function ClassStylesEditor({
  items,
  onCreate,
  onUpdate,
  onDelete,
}: {
  items: ClassStyle[];
  onCreate: (data: Omit<ClassStyleDb, "id">) => Promise<ActionResult>;
  onUpdate: (id: string, data: Omit<ClassStyleDb, "id">) => Promise<ActionResult>;
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
      description: d.description,
      levels: d.levelsCsv.split(",").map((s) => s.trim()).filter(Boolean),
      mediaUrl: d.mediaUrl,
      mediaType: d.mediaType,
      secondaryImageUrl: d.secondaryImageUrl,
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

  const isFormOpen = editingId !== null || adding;

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-accent">{error}</p>}

      {adding ? (
        <div className="border border-accent/40 bg-black/40 p-4 mb-2">
          <FormBody draft={draft} setDraft={setDraft} />
          <div className="mt-3 flex gap-2">
            <button onClick={save} disabled={pending} className="btn-solid !px-4 !py-2 text-xs">
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="btn border border-white/20 !px-4 !py-2 text-xs text-ink-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        !isFormOpen && (
          <button
            onClick={() => {
              setAdding(true);
              setDraft(toDraft());
            }}
            className="flex items-center justify-center gap-2 border border-dashed border-white/20 py-3 text-sm text-ink-muted hover:border-accent hover:text-accent mb-2"
          >
            <Plus size={16} /> Add Class Style
          </button>
        )
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/20 py-10 px-4 text-center rounded">
          <p className="text-sm font-semibold text-ink-muted">No class styles configured yet</p>
          <p className="text-xs text-ink-faint mt-1 mb-4">Add your first style using the button above.</p>
        </div>
      ) : (
        [...items]
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <div key={item.id} className="border border-line bg-black/40 p-4">
              {editingId === item.id ? (
                <FormBody draft={draft} setDraft={setDraft} />
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-heading text-sm font-bold uppercase text-ink">
                      {String(item.order).padStart(2, "0")} — {item.name}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">{item.levels.join(", ")}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
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
                      onClick={() => {
                        if (confirm("Delete this class style?")) onDelete(item.id);
                      }}
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
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn border border-white/20 !px-4 !py-2 text-xs text-ink-muted"
                  >
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

function FormBody({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Order</label>
        <input
          type="number"
          value={draft.sortOrder}
          onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Name</label>
        <input
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Description</label>
        <textarea
          rows={2}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">
          Levels (comma-separated)
        </label>
        <input
          value={draft.levelsCsv}
          onChange={(e) => setDraft({ ...draft, levelsCsv: e.target.value })}
          className={inputClass}
          placeholder="BEGINNER, INTERMEDIATE"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Media</label>
        <CloudinaryUploadField
          value={draft.mediaUrl}
          onChange={(url) => {
            const isVideo = url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov") || url.includes("/video/upload/");
            setDraft({
              ...draft,
              mediaUrl: url,
              mediaType: isVideo ? "video" : "image"
            });
          }}
        />
      </div>
      {draft.mediaType === "image" && (
        <div className="sm:col-span-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs uppercase tracking-wide text-ink-faint">Secondary Image (Optional)</label>
            {draft.secondaryImageUrl && (
              <button
                type="button"
                onClick={() => setDraft({ ...draft, secondaryImageUrl: null })}
                className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 font-semibold"
              >
                Remove Secondary Image
              </button>
            )}
          </div>
          <CloudinaryUploadField
            value={draft.secondaryImageUrl ?? ""}
            onChange={(url) => setDraft({ ...draft, secondaryImageUrl: url || null })}
            accept="image/jpeg,image/png,image/webp,image/avif"
          />
        </div>
      )}
      {draft.mediaUrl && (
        <div className="sm:col-span-2 border border-white/10 p-3 bg-black/20 mt-2">
          <p className="text-xs uppercase tracking-wider text-ink-muted mb-2 font-bold">Previews</p>
          <div className="flex flex-wrap gap-4 items-start">
            {/* Primary Preview */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase text-ink-faint">Primary</span>
              <div className="h-24 w-36 relative bg-bg-raised overflow-hidden">
                <GalleryItem
                  mediaUrl={draft.mediaUrl}
                  mediaType={draft.mediaType}
                  title=""
                  grayscale={false}
                />
              </div>
            </div>

            {/* Secondary Image & Live Previews */}
            {draft.mediaType === "image" && draft.secondaryImageUrl && (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-ink-faint">Secondary Image</span>
                  <div className="h-24 w-36 relative bg-bg-raised overflow-hidden">
                    <GalleryItem
                      mediaUrl={draft.secondaryImageUrl}
                      mediaType="image"
                      title=""
                      grayscale={false}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-ink-faint">Live Preview</span>
                  <div className="h-24 w-36 relative bg-bg-raised overflow-hidden group">
                    <GalleryItem
                      mediaUrl={draft.mediaUrl}
                      mediaType={draft.mediaType}
                      hoverImageUrl={draft.secondaryImageUrl}
                      title=""
                      grayscale={false}
                      autoPlayHover={true}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
