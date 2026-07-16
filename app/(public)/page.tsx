import { Hero } from "@/components/home/Hero";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { CTABanner } from "@/components/ui/CTABanner";
import {
  getGalleryTeaser,
  getPageHero,
  getHeroContent,
  getMarqueeTags,
  getSiteSettings,
  getFounderProfile,
} from "@/lib/cms";

export default async function HomePage() {
  const [heroConfig, heroStatsObj, tags, gallery, settings, founder] = await Promise.all([
    getPageHero("home"),
    getHeroContent(),
    getMarqueeTags(),
    getGalleryTeaser(),
    getSiteSettings(),
    getFounderProfile(),
  ]);

  return (
    <>
      <Hero config={heroConfig} stats={heroStatsObj.stats} />
      <MarqueeStrip tags={tags} />
      <GalleryTeaser items={gallery} />
      <AboutTeaser
        eyebrow={`EST. ${settings.establishedYear} · ${settings.city.toUpperCase()}`}
        headlineLine1={settings.aboutHeroTitle1}
        headlineLine2={settings.aboutHeroTitle2}
        photoUrl={founder.photoUrl}
        founderName={founder.name}
      />
      <CTABanner
        watermarkWord={settings.ctaWatermark}
        heading={settings.ctaHeading}
        primaryCta={{ label: "REGISTER NOW", href: "/register" }}
        contactRow={[
          { label: "phone", value: settings.phone },
          { label: "social", value: settings.instagramUrl ? settings.instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "") : "" },
          { label: "location", value: `${settings.city}, ${settings.region}` },
        ]}
      />
    </>
  );
}
