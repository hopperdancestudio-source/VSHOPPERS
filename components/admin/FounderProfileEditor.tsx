"use client";

import { useState, useTransition } from "react";
import { CloudinaryUploadField } from "@/components/admin/CloudinaryUploadField";
import { GalleryItem } from "@/components/gallery/GalleryItem";
import type { ActionResult } from "@/components/admin/SimpleListEditor";

const inputClass =
  "w-full border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

interface FounderFormValues {
  name: string;
  bio: string;
  photoUrl: string;
  secondaryImageUrl?: string | null;
}

export function FounderProfileEditor({
  initialData,
  onSave,
}: {
  initialData: FounderFormValues;
  onSave: (data: FounderFormValues) => Promise<ActionResult>;
}) {
  const [draft, setDraft] = useState<FounderFormValues>(initialData);
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
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Founder Name</label>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Bio</label>
          <textarea
            rows={4}
            value={draft.bio}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint">Founder Photo (Cloudinary)</label>
          <CloudinaryUploadField
            value={draft.photoUrl}
            onChange={(url) => setDraft({ ...draft, photoUrl: url })}
            accept="image/jpeg,image/png,image/webp,image/avif"
          />
        </div>

        <div>
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

        {draft.photoUrl && (
          <div className="sm:col-span-2 border border-white/10 p-3 bg-black/20 mt-2">
            <p className="text-xs uppercase tracking-wider text-ink-muted mb-2 font-bold">Previews</p>
            <div className="flex flex-wrap gap-4 items-start">
              {/* Primary Preview */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-ink-faint">Primary</span>
                <div className="h-24 w-32 relative bg-bg-raised overflow-hidden">
                  <GalleryItem
                    mediaUrl={draft.photoUrl}
                    mediaType="image"
                    title=""
                    grayscale={false}
                  />
                </div>
              </div>

              {/* Secondary Image & Live Previews */}
              {draft.secondaryImageUrl && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-ink-faint">Secondary Image</span>
                    <div className="h-24 w-32 relative bg-bg-raised overflow-hidden">
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
                    <div className="h-24 w-32 relative bg-bg-raised overflow-hidden group">
                      <GalleryItem
                        mediaUrl={draft.photoUrl}
                        mediaType="image"
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
