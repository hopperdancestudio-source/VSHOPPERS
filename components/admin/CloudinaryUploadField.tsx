"use client";

import { useState } from "react";
import { UploadCloud, Loader2, Trash2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

export function CloudinaryUploadField({
  value,
  onChange,
  accept = "image/*,video/*",
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (accept && accept !== "image/*,video/*" && accept !== "*/*") {
      const allowedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
      const fileType = file.type.toLowerCase();
      const isAllowed = allowedTypes.some((type) => {
        if (type.endsWith("/*")) {
          const category = type.split("/")[0];
          return fileType.startsWith(category + "/");
        }
        return fileType === type;
      });

      if (!isAllowed) {
        setError("Invalid file type. Only image files (JPG, JPEG, PNG, WEBP, AVIF) are allowed.");
        return;
      }
    }

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const isVideo = value && (
    value.endsWith(".mp4") ||
    value.endsWith(".webm") ||
    value.endsWith(".mov") ||
    value.includes("/video/upload/")
  );

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="relative w-fit">
          {isVideo ? (
            <video
              src={value}
              controls
              className="h-28 w-48 rounded bg-black object-cover border border-white/10"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-28 w-48 rounded object-cover border border-white/10"
            />
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="flex cursor-pointer items-center gap-2 border border-white/15 bg-[#141416] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted hover:border-accent hover:text-accent transition-all">
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
          {uploading ? "Uploading..." : value ? "Replace Media" : "Upload to Cloudinary"}
          <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        <input
          type="text"
          placeholder="Or paste URL..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-white/15 bg-[#141416] px-2 py-1.5 text-xs text-ink-muted focus:border-accent focus:outline-none w-48"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex items-center gap-1.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400 transition-all"
          >
            <Trash2 size={13} /> Remove
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-400 font-mono">{error}</p>}
    </div>
  );
}
