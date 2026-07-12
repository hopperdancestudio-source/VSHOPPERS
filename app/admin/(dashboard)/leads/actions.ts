"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TrialLead } from "@/lib/types";

export async function updateLeadStatus(
  id: string,
  status: TrialLead["status"]
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Supabase not configured." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("trial_leads").update({ status }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  return { success: true };
}

export async function deleteLead(id: string): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Supabase not configured." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("trial_leads").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  return { success: true };
}
