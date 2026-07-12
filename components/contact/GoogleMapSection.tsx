"use client";

import { MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

interface GoogleMapSectionProps {
  studioName: string;
  city: string;
  mapsUrl: string;
  addressLine1: string;
  addressLine2: string;
}

export function GoogleMapSection({
  studioName,
  city,
  mapsUrl,
  addressLine1,
  addressLine2,
}: GoogleMapSectionProps) {
  // Gracefully hide the entire section if no mapsUrl exists
  if (!mapsUrl) return null;

  // Intelligently convert the saved Google Maps URL into an embeddable iframe URL
  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    // 1. If it's already an embed URL, return it directly
    if (
      url.includes("/maps/embed") ||
      url.includes("output=embed") ||
      url.includes("/maps/d/embed")
    ) {
      return url;
    }

    try {
      const parsed = new URL(url);

      // 2. If it is a google maps URL containing a query parameter 'q'
      const qParam = parsed.searchParams.get("q");
      if (qParam) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(qParam)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }

      // 3. If it matches a place URL structure like /maps/place/PlaceName/...
      const placeRegex = /\/maps\/place\/([^/]+)/;
      const match = parsed.pathname.match(placeRegex);
      if (match && match[1]) {
        const placeName = decodeURIComponent(match[1].replace(/\+/g, " "));
        return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }

      // 4. If it's a search URL like /maps/search/Query/...
      const searchRegex = /\/maps\/search\/([^/]+)/;
      const searchMatch = parsed.pathname.match(searchRegex);
      if (searchMatch && searchMatch[1]) {
        const searchQuery = decodeURIComponent(searchMatch[1].replace(/\+/g, " "));
        return `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }

      // 5. Fallback for redirect short links maps.app.goo.gl or others:
      // use the studio name + city query as a very reliable fallback.
      const fallbackQuery = `${studioName} ${city}`;
      return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    } catch {
      // If it fails to parse as a URL, treat the entire string as a search query if it is not empty
      if (url.trim().length > 0) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
      // Otherwise fallback to studioName + city
      const fallbackQuery = `${studioName} ${city}`;
      return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  };

  const embedUrl = getEmbedUrl(mapsUrl);

  // If we couldn't produce any embed URL (unlikely due to fallbacks), hide the section
  if (!embedUrl) return null;

  return (
    <section className="relative w-full flex flex-col md:block md:h-[500px] bg-bg overflow-hidden border-y border-line">
      {/* Embedded Google Map Container */}
      <div className="w-full h-[250px] md:h-full md:absolute md:inset-0">
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 grayscale invert-[0.92] contrast-[0.83] opacity-60"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Google Map showing location of ${studioName}`}
        />
        {/* Dark Vignette Overlay (Desktop only, since on mobile we stack card below map) */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/80 pointer-events-none" />
      </div>

      {/* Glassmorphic Card Wrapper */}
      <div className="w-full md:absolute md:inset-0 md:flex md:items-center md:justify-center md:p-4 pointer-events-none md:z-10">
        <Reveal className="pointer-events-auto w-full bg-bg-raised md:bg-bg-raised/90 md:backdrop-blur-md border-t border-b md:border border-line px-6 py-8 md:p-8 text-center flex flex-col items-center gap-4 shadow-2xl md:max-w-md">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/20">
            <MapPin size={22} className="animate-pulse" />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-accent font-semibold mb-1">
              {studioName}
            </p>
            <h3 className="font-display text-2xl md:text-3xl text-ink">
              Find Us in {city}
            </h3>
          </div>
          <p className="font-body text-sm text-ink-muted leading-relaxed max-w-xs">
            {addressLine1}
            {addressLine2 && <><br />{addressLine2}</>}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-accent mt-2 w-full md:w-auto px-8 py-3 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
            aria-label={`Get directions to ${studioName} on Google Maps`}
          >
            Get Directions
          </a>
        </Reveal>
      </div>
    </section>
  );
}
