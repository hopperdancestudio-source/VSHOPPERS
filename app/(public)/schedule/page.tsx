import { PageHero } from "@/components/shared/hero/PageHero";
import { WeeklyFlowTable } from "@/components/schedule/WeeklyFlowTable";
import { MembershipPricing } from "@/components/schedule/MembershipPricing";
import { TrustBadges } from "@/components/schedule/TrustBadges";
import { CTABanner } from "@/components/ui/CTABanner";
import {
  getMembershipPlans,
  getPageHero,
  getScheduleSlots,
  getSiteSettings,
  getTrustBadges,
} from "@/lib/cms";

export const metadata = {
  title: "Schedule",
  description: "Weekly class schedule and membership plans — placeholder copy, replace via CMS.",
};

export default async function SchedulePage() {
  const [slots, plans, badges, settings, heroConfig] = await Promise.all([
    getScheduleSlots(),
    getMembershipPlans(),
    getTrustBadges(),
    getSiteSettings(),
    getPageHero("schedule"),
  ]);

  return (
    <>
      <PageHero config={heroConfig} />
      <WeeklyFlowTable slots={slots} />
      <MembershipPricing plans={plans} />
      <TrustBadges badges={badges} />

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
