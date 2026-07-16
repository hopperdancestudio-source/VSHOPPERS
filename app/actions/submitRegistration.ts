"use server";

import { registrationFormSchema, type RegistrationFormSchema } from "@/lib/validation/registrationForm";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SubmitRegistrationResult {
  success: boolean;
  error?: string;
}

export async function submitRegistrationForm(values: RegistrationFormSchema): Promise<SubmitRegistrationResult> {
  const parsed = registrationFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors." };
  }

  // Handle local fallback if Supabase URL is not set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.info("[registration-form] Supabase not configured, submission not persisted:", parsed.data);
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("registrations").insert({
      student_name: parsed.data.studentName,
      parent_name: parsed.data.parentName,
      mobile: parsed.data.mobile,
      email: parsed.data.email || null,
      dob: parsed.data.dob,
      age: parsed.data.age,
      joining_date: parsed.data.joiningDate,
      dance_style: parsed.data.danceStyle,
      batch_time: parsed.data.batchTime,
      package: parsed.data.package,
      payment_mode: parsed.data.paymentMode,
      batch_days: parsed.data.batchDays,
      emergency_contact: parsed.data.emergencyContact || null,
      medical_condition: parsed.data.medicalCondition || null,
      notes: parsed.data.notes || null,
      agreement: parsed.data.agreement,
      status: "Pending",
      payment_status: "Pending",
      viewed: false,
    });

    if (error) {
      console.error("[registration-form] insert failed:", error.message);
      return { success: false, error: "Something went wrong submitting your registration. Please try again." };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/registrations");
    return { success: true };
  } catch (err) {
    console.error("[registration-form] unexpected error:", err);
    return { success: false, error: "Something went wrong submitting your registration. Please try again." };
  }
}
