import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminSectionCard } from "@/components/admin/SimpleListEditor";
import { RegistrationProfileEditor } from "@/components/admin/RegistrationProfileEditor";
import { getRegistrationById, getRegistrationHistory } from "@/app/admin/(dashboard)/registrations/data";
import {
  updateRegistrationStatus,
  updateRegistrationPaymentStatus,
  updateInternalNotes,
} from "@/app/admin/(dashboard)/registrations/actions";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function RegistrationDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const registration = await getRegistrationById(id);

  if (!registration) {
    notFound();
  }

  // Mark the registration as viewed (read) on page render
  if (!registration.viewed && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    await supabase.from("registrations").update({ viewed: true }).eq("id", id);
    revalidatePath("/admin");
    revalidatePath("/admin/registrations");
    registration.viewed = true; // Update local state for rendering
  }

  const history = await getRegistrationHistory(id);

  // Bind actions with registration ID on the server
  const onUpdateStatus = updateRegistrationStatus.bind(null, id);
  const onUpdatePaymentStatus = updateRegistrationPaymentStatus.bind(null, id);
  const onUpdateNotes = updateInternalNotes.bind(null, id);

  return (
    <AdminSectionCard
      title={`Admission Profile: ${registration.registrationNo}`}
      description="Review personal metadata, joining batches, payment status logs, and timeline history audits."
    >
      <RegistrationProfileEditor
        registration={registration}
        history={history}
        onUpdateStatus={onUpdateStatus}
        onUpdatePaymentStatus={onUpdatePaymentStatus}
        onUpdateNotes={onUpdateNotes}
      />
    </AdminSectionCard>
  );
}
