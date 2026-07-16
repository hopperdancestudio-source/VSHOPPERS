import { PageHero } from "@/components/shared/hero/PageHero";
import { RegistrationForm } from "@/components/register/RegistrationForm";
import { Reveal } from "@/components/ui/Reveal";
import {
  getClassStyles,
  getScheduleSlots,
  getMembershipPlans,
  getSiteSettings,
} from "@/lib/cms";
import type { PageHeroConfig } from "@/lib/types";

export const metadata = {
  title: "Student Registration — VS Hoppers",
  description: "Complete your registration to enroll at VS Hoppers Dance Studio.",
};

export default async function RegisterPage() {
  const [classes, slots, plans, settings] = await Promise.all([
    getClassStyles(),
    getScheduleSlots(),
    getMembershipPlans(),
    getSiteSettings(),
  ]);

  // Extract dynamic form selection values
  const danceStyles = classes.map((c) => c.name);
  const batchTimes = Array.from(new Set(slots.map((s) => s.time)));
  const packages = plans.map((p) => p.name);
  const paymentModes = settings.paymentModes.split(",").map((s) => s.trim());
  const batchDays = settings.batchDays.split(",").map((s) => s.trim());

  const heroConfig: PageHeroConfig = {
    pageKey: "register",
    eyebrow: "ADMISSION OPEN",
    titleLine1: "STUDENT",
    titleLine2: "REGISTRATION",
    description: "Complete your registration to enroll at VS Hoppers Dance Studio. Fill out the registration form below to complete your admission process.",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    desktopImageUrl: "",
    desktopVideoUrl: "",
    desktopVideoPoster: "",
    mobileImageUrl: "",
    mobileVideoUrl: "",
    mobileVideoPoster: "",
    heroHeight: "min-h-[50vh]",
    contentWidth: "Large",
    desktopAlignment: "Left",
    mobileAlignment: "Left",
    verticalAlignment: "Center",
    overlayColor: "#000000",
    overlayOpacity: 0.5,
    gradientType: "Linear",
    backgroundPosition: "center",
    revealAnimation: "Reveal",
    showScrollIndicator: false,
  };

  return (
    <>
      <PageHero config={heroConfig} />

      <section className="bg-bg py-16 md:py-24">
        <div className="container-base max-w-3xl">
          <Reveal>
            <RegistrationForm
              danceStyles={danceStyles}
              batchTimes={batchTimes}
              packages={packages}
              paymentModes={paymentModes}
              batchDays={batchDays}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
