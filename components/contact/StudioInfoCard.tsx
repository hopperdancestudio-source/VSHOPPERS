import { Phone, Mail, MapPin, Globe } from "lucide-react";
import { FaInstagram, FaYoutube, FaWhatsapp, FaFacebook } from "react-icons/fa";
import type { SiteSettings, StudioHours } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

export function StudioInfoCard({
  settings,
  hours,
}: {
  settings: SiteSettings;
  hours: StudioHours[];
}) {
  return (
    <Reveal delay={0.1} className="border-l-2 border-accent bg-bg-raised/40 px-8 py-10">
      <h3 className="font-display text-2xl text-ink">Studio Info</h3>

      <div className="mt-6 flex flex-col gap-5">
        {/* Phone */}
        {settings.phone && (
          <div className="flex items-start gap-3">
            <Phone size={16} className="mt-1 shrink-0 text-accent" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-faint">Call Us</p>
              <a href={`tel:${settings.phone}`} className="font-heading text-sm font-semibold text-ink hover:text-accent">
                {settings.phone}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {settings.email && (
          <div className="flex items-start gap-3">
            <Mail size={16} className="mt-1 shrink-0 text-accent" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-faint">Email</p>
              <a href={`mailto:${settings.email}`} className="font-heading text-sm font-semibold text-ink hover:text-accent">
                {settings.email}
              </a>
            </div>
          </div>
        )}

        {/* Address & Google Maps */}
        <div className="flex items-start gap-3 group">
          <MapPin size={18} className="mt-1 shrink-0 text-accent group-hover:text-[#4285F4] transition-colors" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint">Address</p>
            {settings.mapsUrl ? (
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-sm font-semibold text-ink hover:text-[#4285F4] transition-colors"
              >
                {settings.addressLine1}, {settings.addressLine2}
              </a>
            ) : (
              <p className="font-heading text-sm font-semibold text-ink">
                {settings.addressLine1}, {settings.addressLine2}
              </p>
            )}
          </div>
        </div>

        {/* Instagram */}
        {settings.instagramUrl && (
          <div className="flex items-start gap-3 group">
            <FaInstagram size={18} className="mt-1 shrink-0 text-accent group-hover:text-[#E1306C] transition-colors" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-faint">Instagram</p>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-sm font-semibold text-ink hover:text-[#E1306C] transition-colors"
              >
                Instagram Profile
              </a>
            </div>
          </div>
        )}

        {/* YouTube */}
        {settings.youtubeUrl && (
          <div className="flex items-start gap-3 group">
            <FaYoutube size={18} className="mt-1 shrink-0 text-accent group-hover:text-[#FF0000] transition-colors" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-faint">YouTube</p>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-sm font-semibold text-ink hover:text-[#FF0000] transition-colors"
              >
                YouTube Channel
              </a>
            </div>
          </div>
        )}

        {/* WhatsApp */}
        {settings.whatsappUrl && (
          <div className="flex items-start gap-3 group">
            <FaWhatsapp size={18} className="mt-1 shrink-0 text-accent group-hover:text-[#25D366] transition-colors" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-faint">WhatsApp</p>
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-sm font-semibold text-ink hover:text-[#25D366] transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Facebook */}
        {settings.facebookUrl && (
          <div className="flex items-start gap-3 group">
            <FaFacebook size={18} className="mt-1 shrink-0 text-accent group-hover:text-[#1877F2] transition-colors" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-faint">Facebook</p>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-sm font-semibold text-ink hover:text-[#1877F2] transition-colors"
              >
                Facebook Page
              </a>
            </div>
          </div>
        )}

        {/* Website */}
        {settings.websiteUrl && (
          <div className="flex items-start gap-3 group">
            <Globe size={18} className="mt-1 shrink-0 text-accent group-hover:text-accent transition-colors" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-faint">Website</p>
              <a
                href={settings.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-sm font-semibold text-ink hover:text-accent transition-colors"
              >
                {settings.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <p className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-gold">
          Studio Hours
        </p>
        <div className="flex flex-col gap-2">
          {[...hours]
            .sort((a, b) => a.order - b.order)
            .map((h) => (
              <div key={h.label} className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">{h.label}</span>
                <span className={h.closed ? "text-accent font-bold" : "text-ink"}>
                  {h.closed ? "CLOSED" : h.hours}
                </span>
              </div>
            ))}
        </div>
      </div>
    </Reveal>
  );
}
