import { AdminSectionCard, SimpleListEditor, type FieldConfig } from "@/components/admin/SimpleListEditor";
import { ScheduleSlotsEditor } from "@/components/admin/ScheduleSlotsEditor";
import { MembershipPlansEditor } from "@/components/admin/MembershipPlansEditor";
import { getMembershipPlans, getScheduleSlots, getTrustBadges } from "@/lib/cms";
import { makeCrudActions } from "@/lib/supabase/crudFactory";
import type { MembershipPlanDb, ScheduleSlot, TrustBadge } from "@/lib/types";

const badgeFields: FieldConfig<Omit<TrustBadge, "id">>[] = [
  { name: "icon", label: "Icon (lucide name: party-popper, lock-open, users)", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
];

export default async function AdminSchedulePage() {
  const [slots, plans, badges] = await Promise.all([
    getScheduleSlots(),
    getMembershipPlans(),
    getTrustBadges(),
  ]);

  const slotActions = makeCrudActions<ScheduleSlot>("schedule_slots", ["/admin/schedule", "/schedule"]);
  const planActions = makeCrudActions<MembershipPlanDb>("membership_plans", ["/admin/schedule", "/schedule"]);
  const badgeActions = makeCrudActions<TrustBadge>("trust_badges", ["/admin/schedule", "/schedule"]);

  return (
    <div>

      <AdminSectionCard title="Weekly Schedule">
        <ScheduleSlotsEditor
          items={slots}
          onCreate={slotActions.create}
          onUpdate={slotActions.update}
          onDelete={slotActions.remove}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Membership Plans">
        <MembershipPlansEditor
          items={plans}
          onCreate={planActions.create}
          onUpdate={planActions.update}
          onDelete={planActions.remove}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Trust Badges" description="The 3 icon+text callouts under pricing.">
        <SimpleListEditor<TrustBadge>
          fields={badgeFields}
          items={badges}
          emptyItem={{ icon: "users", title: "", description: "" }}
          onCreate={badgeActions.create}
          onUpdate={badgeActions.update}
          onDelete={badgeActions.remove}
        />
      </AdminSectionCard>
    </div>
  );
}
