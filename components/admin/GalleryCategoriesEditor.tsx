"use client";

import { useState, useTransition, useEffect } from "react";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Reorder } from "framer-motion";
import type { GalleryCategory } from "@/lib/types";
import type { ActionResult } from "@/components/admin/SimpleListEditor";

const inputClass =
  "w-full border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

interface GalleryCategoriesEditorProps {
  categories: GalleryCategory[];
  onCreate: (data: Omit<GalleryCategory, "id">) => Promise<ActionResult>;
  onUpdate: (id: string, data: Omit<GalleryCategory, "id">) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
  onReorder: (ids: string[]) => Promise<ActionResult>;
}

export function GalleryCategoriesEditor({
  categories,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
}: GalleryCategoriesEditorProps) {
  const [list, setList] = useState<GalleryCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", slug: "", sortOrder: 0 });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Sync state and sort initially when server categories change
  useEffect(() => {
    const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    setList(sorted);
  }, [categories]);

  const handleNameChange = (nameVal: string) => {
    const slugVal = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setDraft((prev) => ({ ...prev, name: nameVal, slug: slugVal }));
  };

  const saveNew = () => {
    if (!draft.name.trim()) {
      setError("Category name is required.");
      return;
    }
    startTransition(async () => {
      const res = await onCreate({
        name: draft.name,
        slug: draft.slug,
        sortOrder: list.length + 1,
      });
      if (res.success) {
        setAdding(false);
        setDraft({ name: "", slug: "", sortOrder: 0 });
        setError(null);
      } else {
        setError(res.error ?? "Failed to create category.");
      }
    });
  };

  const saveEdit = (id: string) => {
    if (!draft.name.trim()) {
      setError("Category name is required.");
      return;
    }
    startTransition(async () => {
      const res = await onUpdate(id, {
        name: draft.name,
        slug: draft.slug,
        sortOrder: draft.sortOrder,
      });
      if (res.success) {
        setEditingId(null);
        setDraft({ name: "", slug: "", sortOrder: 0 });
        setError(null);
      } else {
        setError(res.error ?? "Failed to save category.");
      }
    });
  };

  const remove = (id: string) => {
    const cat = list.find((c) => c.id === id);
    if (!cat) return;
    if (cat.slug === "team") {
      alert("The TEAM category is required for internal systems and cannot be deleted.");
      return;
    }
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    startTransition(async () => {
      const res = await onDelete(id);
      if (res.success) {
        setError(null);
      } else {
        setError(res.error ?? "Failed to delete category.");
      }
    });
  };

  const handleReorder = (newOrder: GalleryCategory[]) => {
    setList(newOrder);
    startTransition(async () => {
      const ids = newOrder.map((c) => c.id);
      const res = await onReorder(ids);
      if (!res.success) {
        setError(res.error ?? "Failed to save new order.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="bg-accent/10 border border-accent/20 text-accent text-sm px-4 py-3 rounded">
          {error}
        </div>
      )}

      {adding ? (
        <div className="border border-accent/40 bg-black/40 p-4 mb-2 flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Add New Category</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Name</label>
              <input
                value={draft.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Hip-Hop"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Slug (Auto-generated)</label>
              <input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder="e.g. hip-hop"
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-1">
            <button onClick={saveNew} disabled={pending} className="btn-solid !px-4 !py-2 text-xs">
              Add Category
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setError(null);
              }}
              className="btn border border-white/20 !px-4 !py-2 text-xs text-ink-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setAdding(true);
            setEditingId(null);
            setDraft({ name: "", slug: "", sortOrder: 0 });
            setError(null);
          }}
          className="flex items-center justify-center gap-2 border border-dashed border-white/20 py-3 text-sm text-ink-muted hover:border-accent hover:text-accent mb-2"
        >
          <Plus size={16} /> Add Gallery Category
        </button>
      )}

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/20 py-10 px-4 text-center rounded">
          <p className="text-sm font-semibold text-ink-muted">No categories configured yet</p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={list}
          onReorder={handleReorder}
          className="flex flex-col gap-2"
        >
          {list.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <Reorder.Item
                key={item.id}
                value={item}
                className="border border-line bg-black/40 p-4 flex flex-col gap-3 rounded cursor-grab active:cursor-grabbing select-none"
                style={{ touchAction: "none" }}
              >
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-accent">Edit Category</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Name</label>
                        <input
                          value={draft.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Slug</label>
                        <input
                          value={draft.slug}
                          onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(item.id)}
                        disabled={pending}
                        className="btn-solid !px-4 !py-2 text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setError(null);
                        }}
                        className="btn border border-white/20 !px-4 !py-2 text-xs text-ink-muted"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-ink-faint shrink-0 cursor-row-resize" />
                      <div>
                        <p className="font-heading text-sm font-semibold uppercase tracking-wider text-ink">
                          {item.name}
                        </p>
                        <p className="text-xs text-ink-faint mt-0.5">Slug: {item.slug}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-3 items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(item.id);
                          setDraft({ name: item.name, slug: item.slug, sortOrder: item.sortOrder });
                          setAdding(false);
                          setError(null);
                        }}
                        className="text-ink-muted hover:text-accent p-1"
                        title="Rename Category"
                      >
                        <Pencil size={15} />
                      </button>
                      {item.slug !== "team" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(item.id);
                          }}
                          className="text-ink-muted hover:text-accent p-1"
                          title="Delete Category"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </div>
  );
}
