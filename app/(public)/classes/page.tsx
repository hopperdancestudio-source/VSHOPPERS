import { PageHero } from "@/components/shared/hero/PageHero";
import { ClassDetailRow } from "@/components/classes/ClassDetailRow";
import { BatchesSection } from "@/components/shared/BatchesSection";
import { CTABanner } from "@/components/ui/CTABanner";
import { getAgeBatches, getClassStyles, getPageHero, getSiteSettings } from "@/lib/cms";

export const metadata = {
  title: "Classes",
  description: "Explore every class style — placeholder copy, replace via CMS.",
};

export default async function ClassesPage() {
  const [styles, batches, settings, heroConfig] = await Promise.all([
    getClassStyles(),
    getAgeBatches(),
    getSiteSettings(),
    getPageHero("classes"),
  ]);

  return (
    <>
      <PageHero config={heroConfig} />

      <section className="bg-bg py-section-y-sm md:py-section-y">
        <div className="container-base">
          {[...styles]
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <ClassDetailRow key={item.id} item={item} />
            ))}
        </div>
      </section>

      <BatchesSection batches={batches} />

      <CTABanner
        watermarkWord={settings.ctaWatermark}
        heading={settings.ctaHeading}
        primaryCta={{ label: settings.ctaBtnLabel, href: "/contact" }}
        contactRow={[
          { label: "phone", value: settings.phone },
          { label: "social", value: settings.instagramUrl ? settings.instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "") : "" },
          { label: "location", value: `${settings.city}, ${settings.region}` },
        ]}
      />
    </>
  );
}
