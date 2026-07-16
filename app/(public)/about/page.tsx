import { PageHero } from "@/components/shared/hero/PageHero";
import { FounderIntro } from "@/components/about/FounderIntro";
import { StatsBar } from "@/components/about/StatsBar";
import { CoreValues } from "@/components/about/CoreValues";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { TeamGallery } from "@/components/about/TeamGallery";
import { CTABanner } from "@/components/ui/CTABanner";
import {
  getAboutStats,
  getCoreValues,
  getFounderProfile,
  getJourneyMilestones,
  getPageHero,
  getSiteSettings,
  getTeamPhotos,
} from "@/lib/cms";

export const metadata = {
  title: "About",
  description: "Our story, values, and journey — placeholder copy, replace via CMS.",
};

export default async function AboutPage() {
  const [stats, founder, values, milestones, team, settings, heroConfig] = await Promise.all([
    getAboutStats(),
    getFounderProfile(),
    getCoreValues(),
    getJourneyMilestones(),
    getTeamPhotos(),
    getSiteSettings(),
    getPageHero("about"),
  ]);

  return (
    <>
      <PageHero config={heroConfig} />

      <FounderIntro founderName={founder.name} bio={founder.bio} photoUrl={founder.photoUrl} secondaryImageUrl={founder.secondaryImageUrl} />
      <StatsBar stats={stats} />
      <CoreValues values={values} />
      <JourneyTimeline milestones={milestones} />
      <TeamGallery photos={team} />

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
