import { PageHero } from "@/components/shared/hero/PageHero";
import { GalleryBrowser } from "@/components/gallery/GalleryBrowser";
import { InstagramCTA } from "@/components/gallery/InstagramCTA";
import { CTABanner } from "@/components/ui/CTABanner";
import { getGalleryFilters, getGalleryItems, getPageHero, getSiteSettings } from "@/lib/cms";

export const metadata = {
  title: "Gallery",
  description: "Moments in motion — placeholder gallery, replace via CMS + Cloudinary.",
};

export default async function GalleryPage() {
  const [items, filters, settings, heroConfig] = await Promise.all([
    getGalleryItems(),
    getGalleryFilters(),
    getSiteSettings(),
    getPageHero("gallery"),
  ]);

  return (
    <>
      <PageHero config={heroConfig} />
      <GalleryBrowser items={items} filters={filters} />
      <InstagramCTA url={settings.instagramUrl} />
      <CTABanner
        watermarkWord={settings.ctaWatermark}
        heading={settings.ctaHeading}
        primaryCta={{ label: "REGISTER NOW", href: "/register" }}
        secondaryCta={{ label: "View Schedule", href: "/schedule" }}
        contactRow={[
          { label: "call us", value: settings.phone },
          { label: "social", value: settings.instagramUrl ? settings.instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "") : "" },
          { label: "location", value: `${settings.city}, ${settings.region}` },
        ]}
      />
    </>
  );
}
