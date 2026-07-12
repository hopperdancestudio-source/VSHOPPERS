"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { GalleryCategory, GalleryItem, GalleryItemDb } from "@/lib/types";
import type { ActionResult } from "@/components/admin/SimpleListEditor";
import { CloudinaryUploadField } from "@/components/admin/CloudinaryUploadField";
import { GalleryItem as GalleryItemPreview } from "@/components/gallery/GalleryItem";

const inputClass =
  "w-full border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

type Draft = Omit<GalleryItem, "id" | "order" | "category"> & { id?: string; sortOrder: number; categoryId: string };

function toDraft(item?: GalleryItem, defaultCategoryId: string = ""): Draft {
  return {
    mediaUrl: item?.mediaUrl ?? "",
    hoverImageUrl: item?.hoverImageUrl ?? null,
    mediaType: item?.mediaType ?? "image",
    title: item?.title ?? "",
    categoryId: item?.categoryId ?? defaultCategoryId,
    sortOrder: item?.order ?? 1,
    id: item?.id,
  };
}

export function GalleryItemsEditor({
  items,
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: {
  items: GalleryItem[];
  categories: GalleryCategory[];
  onCreate: (data: Omit<GalleryItemDb, "id">) => Promise<ActionResult>;
  onUpdate: (id: string, data: Omit<GalleryItemDb, "id">) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  
  const defaultCategoryId = categories[0]?.id ?? "";
  const [draft, setDraft] = useState<Draft>(() => toDraft(undefined, defaultCategoryId));
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
        setDraft(toDraft(undefined, defaultCategoryId));
      } else {
        setError(result.error ?? "Failed to save.");
      }
    });
  }

  const Form = (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
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
            <label className="text-xs uppercase tracking-wide text-ink-faint">Hover Image (Optional)</label>
            {draft.hoverImageUrl && (
              <button
                type="button"
                onClick={() => setDraft({ ...draft, hoverImageUrl: null })}
                className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 font-semibold"
              >
                Remove Hover Image
              </button>
            )}
          </div>
          <CloudinaryUploadField
            value={draft.hoverImageUrl ?? ""}
            onChange={(url) => setDraft({ ...draft, hoverImageUrl: url || null })}
            accept="image/jpeg,image/png,image/webp,image/avif"
          />
        </div>
      )}
      <select
        value={draft.mediaType}
        onChange={(e) => setDraft({ ...draft, mediaType: e.target.value as "image" | "video" })}
        className={inputClass}
      >
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>
      <select
        value={draft.categoryId}
        onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}
        className={inputClass}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <input
        value={draft.title ?? ""}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        placeholder="Overlay title (optional)"
        className={inputClass}
      />
      <input
        type="number"
        value={draft.sortOrder}
        onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
        placeholder="Sort order"
        className={inputClass}
      />
      {draft.mediaUrl && (
        <div className="sm:col-span-2 border border-white/10 p-3 bg-black/20 mt-2">
          <p className="text-xs uppercase tracking-wider text-ink-muted mb-2 font-bold">Previews</p>
          <div className="flex flex-wrap gap-4 items-start">
            {/* Primary Preview */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase text-ink-faint">Primary</span>
              <div className="h-24 w-36 relative bg-bg-raised overflow-hidden">
                <GalleryItemPreview
                  mediaUrl={draft.mediaUrl}
                  mediaType={draft.mediaType}
                  title=""
                  grayscale={false}
                />
              </div>
            </div>

            {/* Hover Image & Alternate Previews */}
            {draft.mediaType === "image" && draft.hoverImageUrl && (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-ink-faint">Hover Image</span>
                  <div className="h-24 w-36 relative bg-bg-raised overflow-hidden">
                    <GalleryItemPreview
                      mediaUrl={draft.hoverImageUrl}
                      mediaType="image"
                      title=""
                      grayscale={false}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-ink-faint">Live Hover Preview</span>
                  <div className="h-24 w-36 relative bg-bg-raised overflow-hidden group">
                    <GalleryItemPreview
                      mediaUrl={draft.mediaUrl}
                      mediaType={draft.mediaType}
                      hoverImageUrl={draft.hoverImageUrl}
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

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-accent">{error}</p>}

      {adding && (
        <div className="border border-accent/40 bg-black/40 p-4 mb-2">
          {Form}
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
            setDraft(toDraft(undefined, defaultCategoryId));
          }}
          className="flex items-center justify-center gap-2 border border-dashed border-white/20 py-3 text-sm text-ink-muted hover:border-accent hover:text-accent mb-2"
        >
          <Plus size={16} /> Add Gallery Item
        </button>
      )}

      {editingId && (
        <div className="border border-accent/40 bg-black/40 p-4 mb-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">Edit Gallery Item</p>
          {Form}
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
          <p className="text-sm font-semibold text-ink-muted">No gallery items configured yet</p>
          <p className="text-xs text-ink-faint mt-1 mb-4">Add your first media file using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[...items]
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <div key={item.id} className="border border-line bg-black/40 p-3">
                <div className="aspect-square bg-bg-raised">
                  <GalleryItemPreview
                    mediaUrl={item.mediaUrl}
                    mediaType={item.mediaType}
                    hoverImageUrl={item.hoverImageUrl}
                    title={item.title}
                    grayscale={false}
                  />
                </div>
                <p className="mt-2 truncate text-xs text-ink-muted">{item.category}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setDraft(toDraft(item, defaultCategoryId));
                      setAdding(false);
                    }}
                    className="text-ink-muted hover:text-accent"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => confirm("Delete this item?") && onDelete(item.id)}
                    className="text-ink-muted hover:text-accent"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
