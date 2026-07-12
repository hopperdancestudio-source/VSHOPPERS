import { AdminSectionCard } from "@/components/admin/SimpleListEditor";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { getLeads } from "@/app/admin/(dashboard)/leads/data";
import { getClassStyles } from "@/lib/cms";

export const revalidate = 0;

export default async function AdminLeadsPage() {
  const [leads, classStyles] = await Promise.all([getLeads(), getClassStyles()]);

  return (
    <div>
      <AdminSectionCard title="Trial Booking Submissions" description="From the Contact page form.">
        <LeadsTable leads={leads} classStyles={classStyles} />
      </AdminSectionCard>
    </div>
  );
}
