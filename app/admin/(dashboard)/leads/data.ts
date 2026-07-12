import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { TrialLead } from "@/lib/types";

/** Plain server-side data loader (not a Server Action - read-only, server-component use only). */
export async function getLeads(): Promise<TrialLead[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trial_leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    classInterest: row.class_interest,
    ageGroup: row.age_group,
    preferredDays: row.preferred_days ?? [],
    message: row.message ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  }));
}
