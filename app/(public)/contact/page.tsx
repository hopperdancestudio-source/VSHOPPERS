import { PageHero } from "@/components/shared/hero/PageHero";
import { TrialForm } from "@/components/contact/TrialForm";
import { StudioInfoCard } from "@/components/contact/StudioInfoCard";
import { GoogleMapSection } from "@/components/contact/GoogleMapSection";
import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { CTABanner } from "@/components/ui/CTABanner";
import { Reveal } from "@/components/ui/Reveal";
import { getFaqItems, getPageHero, getSiteSettings, getStudioHours, getClassStyles } from "@/lib/cms";

export const metadata = {
  title: "Contact — Book a Free Trial",
  description: "Book your free trial class — placeholder copy, replace via CMS.",
};

export default async function ContactPage() {
  const [settings, hours, faqs, heroConfig, classStyles] = await Promise.all([
    getSiteSettings(),
    getStudioHours(),
    getFaqItems(),
    getPageHero("contact"),
    getClassStyles(),
  ]);

  return (
    <>
      <PageHero config={heroConfig} />

      <section className="bg-bg pb-12 md:pb-16">
        <div className="container-base grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <TrialForm classStyles={classStyles} />
          </Reveal>
          <StudioInfoCard settings={settings} hours={hours} />
        </div>
      </section>

      <GoogleMapSection
        studioName={settings.studioName}
        city={settings.city}
        mapsUrl={settings.mapsUrl}
        addressLine1={settings.addressLine1}
        addressLine2={settings.addressLine2}
      />

      <FaqAccordion items={faqs} className="pt-12 md:pt-16 pb-section-y-sm md:pb-section-y" />

      <CTABanner
        watermarkWord={settings.ctaWatermark}
        heading={settings.ctaHeading}
        primaryCta={{ label: "REGISTER NOW", href: "/register" }}
        contactRow={[
          { label: "call us", value: settings.phone },
          { label: "social", value: settings.instagramUrl ? settings.instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "") : "" },
          { label: "location", value: `${settings.city}, ${settings.region}` },
        ]}
      />
    </>
  );
}
