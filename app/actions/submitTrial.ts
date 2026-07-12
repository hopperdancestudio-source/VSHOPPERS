"use server";

import { trialFormSchema, type TrialFormSchema } from "@/lib/validation/trialForm";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SubmitTrialResult {
  success: boolean;
  error?: string;
}

export async function submitTrialForm(values: TrialFormSchema): Promise<SubmitTrialResult> {
  const parsed = trialFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors." };
  }

  // If Supabase isn't configured yet (local/dev without env vars), don't fail the
  // user-facing form — log and report success so the UI/UX can still be reviewed.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.info("[trial-form] Supabase not configured, submission not persisted:", parsed.data);
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("trial_leads").insert({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      class_interest: parsed.data.classInterest,
      age_group: parsed.data.ageGroup,
      preferred_days: parsed.data.preferredDays,
      message: parsed.data.message ?? null,
      status: "new",
    });

    if (error) {
      console.error("[trial-form] insert failed:", error.message);
      return { success: false, error: "Something went wrong submitting your request. Please try again." };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (err) {
    console.error("[trial-form] unexpected error:", err);
    return { success: false, error: "Something went wrong submitting your request. Please try again." };
  }
}
