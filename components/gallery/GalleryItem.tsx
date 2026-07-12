"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface GalleryItemProps {
  mediaUrl?: string | null;
  mediaType?: "image" | "video" | null;
  title?: string | null;
  isPriority?: boolean;
  grayscale?: boolean;
  hoverImageUrl?: string | null;
  autoPlayHover?: boolean;
}

export function GalleryItem({
  mediaUrl,
  mediaType = "image",
  title = "",
  isPriority = false,
  grayscale = true,
  hoverImageUrl,
  autoPlayHover = false,
}: GalleryItemProps) {
  const [hasHoverError, setHasHoverError] = useState(false);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(false);

  useEffect(() => {
    if (!autoPlayHover || !hoverImageUrl || hasHoverError) return;
    const interval = setInterval(() => {
      setIsAutoPlayActive((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, [autoPlayHover, hoverImageUrl, hasHoverError]);

  if (!mediaUrl) {
    return (
      <div className="flex h-full w-full min-h-[inherit] items-center justify-center bg-bg-raised text-ink-faint text-xs font-heading uppercase tracking-wide">
        No Media
      </div>
    );
  }

  const isVideo =
    mediaType === "video" ||
    (mediaUrl ? (
      mediaUrl.endsWith(".mp4") ||
      mediaUrl.endsWith(".webm") ||
      mediaUrl.endsWith(".mov") ||
      mediaUrl.includes("/video/upload/")
    ) : false);

  if (isVideo) {
    return (
      <div className="relative h-full w-full overflow-hidden select-none">
        <video
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover transition-all duration-500 ease-reveal group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
          <Play size={14} fill="currentColor" />
        </span>
      </div>
    );
  }

  const hasHover = hoverImageUrl && !hasHoverError;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={mediaUrl}
        alt={title ?? "Gallery item"}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className={`object-cover ${
          hasHover
            ? "transition-opacity duration-300 ease-in-out"
            : "transition-all duration-500 ease-reveal group-hover:scale-105"
        } ${grayscale ? "grayscale group-hover:grayscale-0" : ""}`}
        priority={isPriority}
      />
      {hasHover && (
        <Image
          src={hoverImageUrl}
          alt={title ? `${title} hover` : "Gallery item hover"}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          onError={() => setHasHoverError(true)}
          className={`object-cover absolute inset-0 transition-opacity duration-300 ease-in-out pointer-events-none ${
            grayscale ? "grayscale [@media(hover:hover)]:group-hover:grayscale-0" : ""
          } ${
            isAutoPlayActive ? "opacity-100" : "opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
          }`}
        />
      )}
    </div>
  );
}
