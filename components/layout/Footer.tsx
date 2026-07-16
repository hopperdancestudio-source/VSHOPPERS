import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import { navLinks } from "@/data/placeholder";
import { FaInstagram, FaYoutube, FaWhatsapp, FaFacebook } from "react-icons/fa";
import { MapPin, Globe } from "lucide-react";

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-sunken pt-20">
      <div className="container-base grid grid-cols-1 gap-12 pb-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="mb-4 flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="VS Logo"
              width={24}
              height={24}
              className="h-6 w-auto object-contain shrink-0"
            />
            <span className="font-display text-lg tracking-wide text-ink">
              {settings.studioName.toUpperCase()}
            </span>
          </Link>
          <p className="max-w-xs font-body text-sm leading-relaxed text-ink-muted">
            {settings.tagline}
          </p>
          <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-ink-muted">
            {settings.addressLine1}
            <br />
            {settings.addressLine2}
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Connect</p>
          <ul className="flex flex-col gap-3 font-body text-sm text-ink-muted">
            {settings.phone && <li>{settings.phone}</li>}
            {settings.instagramUrl && (
              <li>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-[#E1306C]"
                  aria-label="Instagram Profile"
                >
                  <FaInstagram size={18} className="shrink-0" />
                  <span>Instagram</span>
                </a>
              </li>
            )}
            {settings.youtubeUrl && (
              <li>
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-[#FF0000]"
                  aria-label="YouTube Channel"
                >
                  <FaYoutube size={18} className="shrink-0" />
                  <span>YouTube</span>
                </a>
              </li>
            )}
            {settings.whatsappUrl && (
              <li>
                <a
                  href={settings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-[#25D366]"
                  aria-label="Chat on WhatsApp"
                >
                  <FaWhatsapp size={18} className="shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </li>
            )}
            {settings.mapsUrl && (
              <li>
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-[#4285F4]"
                  aria-label="Get Directions on Google Maps"
                >
                  <MapPin size={18} className="shrink-0" />
                  <span>Get Directions</span>
                </a>
              </li>
            )}
            {settings.facebookUrl && (
              <li>
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-[#1877F2]"
                  aria-label="Facebook Page"
                >
                  <FaFacebook size={18} className="shrink-0" />
                  <span>Facebook</span>
                </a>
              </li>
            )}
            {settings.websiteUrl && (
              <li>
                <a
                  href={settings.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-accent"
                  aria-label="Visit Website"
                >
                  <Globe size={18} className="shrink-0" />
                  <span>Website</span>
                </a>
              </li>
            )}
            <li className="mt-1">
              <Link href="/register" className="hover:text-ink font-semibold">
                REGISTER NOW
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-base flex flex-col gap-2 py-6 text-xs text-ink-faint md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.copyrightName}. All rights reserved.
          </p>
          <p>
            {settings.city} · {settings.region}
          </p>
        </div>
      </div>
    </footer>
  );
}
