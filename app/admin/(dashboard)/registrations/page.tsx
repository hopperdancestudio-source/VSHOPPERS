import { AdminSectionCard } from "@/components/admin/SimpleListEditor";
import { RegistrationsTable } from "@/components/admin/RegistrationsTable";
import { getRegistrations } from "@/app/admin/(dashboard)/registrations/data";
import {
  getClassStyles,
  getScheduleSlots,
  getMembershipPlans,
  getSiteSettings,
} from "@/lib/cms";

export const revalidate = 0;

export default async function AdminRegistrationsPage() {
  const [registrations, classes, slots, plans, settings] = await Promise.all([
    getRegistrations(true), // Load all including soft-deleted ones for the archive manager toggle
    getClassStyles(),
    getScheduleSlots(),
    getMembershipPlans(),
    getSiteSettings(),
  ]);

  // Extract dynamic selection arrays for filter and edit selectors
  const danceStyles = classes.map((c) => c.name);
  const batchTimes = Array.from(new Set(slots.map((s) => s.time)));
  const packages = plans.map((p) => p.name);
  const paymentModes = settings.paymentModes.split(",").map((s) => s.trim());
  const batchDays = settings.batchDays.split(",").map((s) => s.trim());

  return (
    <div>
      <AdminSectionCard
        title="Student Registrations CMS"
        description="Review student registration forms, assign schedules, audit payment statuses, edit profile fields, and log notes."
      >
        <RegistrationsTable
          registrations={registrations}
          danceStyles={danceStyles}
          batchTimes={batchTimes}
          packages={packages}
          paymentModes={paymentModes}
          batchDays={batchDays}
        />
      </AdminSectionCard>
    </div>
  );
}
