"use client";

import { useEffect, useState } from "react";
import type { PageHeroConfig } from "@/lib/types";

export function PageHeroBackground({ config }: { config: PageHeroConfig }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (isMobile === null) {
    return <div className="absolute inset-0 bg-bg" />;
  }

  const imageUrl = isMobile 
    ? (config.mobileImageUrl || config.desktopImageUrl)
    : (config.desktopImageUrl || config.mobileImageUrl);

  const videoUrl = isMobile 
    ? (config.mobileVideoUrl || config.desktopVideoUrl)
    : (config.desktopVideoUrl || config.mobileVideoUrl);

  const posterUrl = isMobile
    ? (config.mobileVideoPoster || config.desktopVideoPoster)
    : (config.desktopVideoPoster || config.mobileVideoPoster);

  const isVideo = !!videoUrl;
  const isImage = !isVideo && !!imageUrl;

  if (!isVideo && !isImage) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-bg-raised/60 to-black" />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      {isVideo ? (
        <video
          key={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterUrl || undefined}
          className="h-full w-full object-cover"
          style={{ objectPosition: config.backgroundPosition }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: config.backgroundPosition }}
        />
      )}
    </div>
  );
}
