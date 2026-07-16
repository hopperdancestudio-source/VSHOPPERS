"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StudentRegistration } from "@/lib/types";

export async function updateRegistrationStatus(
  id: string,
  status: StudentRegistration["status"]
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Supabase not configured." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("registrations").update({ status, viewed: true }).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin");
    revalidatePath("/admin/registrations");
    revalidatePath(`/admin/registrations/${id}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update status.";
    return { success: false, error: message };
  }
}

export async function updateRegistrationPaymentStatus(
  id: string,
  paymentStatus: StudentRegistration["paymentStatus"]
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Supabase not configured." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("registrations").update({ payment_status: paymentStatus, viewed: true }).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin");
    revalidatePath("/admin/registrations");
    revalidatePath(`/admin/registrations/${id}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update payment status.";
    return { success: false, error: message };
  }
}

export async function updateInternalNotes(
  id: string,
  internalNotes: string
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Supabase not configured." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("registrations").update({ internal_notes: internalNotes, viewed: true }).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin");
    revalidatePath("/admin/registrations");
    revalidatePath(`/admin/registrations/${id}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update internal notes.";
    return { success: false, error: message };
  }
}

export async function softDeleteRegistration(id: string): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Supabase not configured." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("registrations").update({ deleted_at: new Date().toISOString() }).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin");
    revalidatePath("/admin/registrations");
    revalidatePath(`/admin/registrations/${id}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to archive registration.";
    return { success: false, error: message };
  }
}

export async function restoreRegistration(id: string): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Supabase not configured." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("registrations").update({ deleted_at: null }).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin");
    revalidatePath("/admin/registrations");
    revalidatePath(`/admin/registrations/${id}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to restore registration.";
    return { success: false, error: message };
  }
}

export async function markAsViewed(id: string): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Supabase not configured." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("registrations").update({ viewed: true }).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin");
    revalidatePath("/admin/registrations");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to mark as viewed.";
    return { success: false, error: message };
  }
}

export async function updateRegistration(
  id: string,
  data: Partial<Omit<StudentRegistration, "id">>
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Supabase not configured." };
  }
  try {
    const supabase = await createClient();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbPayload: any = {};
    if (data.studentName !== undefined) dbPayload.student_name = data.studentName;
    if (data.parentName !== undefined) dbPayload.parent_name = data.parentName;
    if (data.mobile !== undefined) dbPayload.mobile = data.mobile;
    if (data.email !== undefined) dbPayload.email = data.email || null;
    if (data.dob !== undefined) dbPayload.dob = data.dob;
    if (data.age !== undefined) dbPayload.age = data.age;
    if (data.joiningDate !== undefined) dbPayload.joining_date = data.joiningDate;
    if (data.danceStyle !== undefined) dbPayload.dance_style = data.danceStyle;
    if (data.batchTime !== undefined) dbPayload.batch_time = data.batchTime;
    if (data.package !== undefined) dbPayload.package = data.package;
    if (data.paymentMode !== undefined) dbPayload.payment_mode = data.paymentMode;
    if (data.batchDays !== undefined) dbPayload.batch_days = data.batchDays;
    if (data.emergencyContact !== undefined) dbPayload.emergency_contact = data.emergencyContact || null;
    if (data.medicalCondition !== undefined) dbPayload.medical_condition = data.medicalCondition || null;
    if (data.notes !== undefined) dbPayload.notes = data.notes || null;
    if (data.status !== undefined) dbPayload.status = data.status;
    if (data.paymentStatus !== undefined) dbPayload.payment_status = data.paymentStatus;
    if (data.internalNotes !== undefined) dbPayload.internal_notes = data.internalNotes;
    
    dbPayload.viewed = true;
    dbPayload.updated_at = new Date().toISOString();

    const { error } = await supabase.from("registrations").update(dbPayload).eq("id", id);
    if (error) return { success: false, error: error.message };
    
    revalidatePath("/admin");
    revalidatePath("/admin/registrations");
    revalidatePath(`/admin/registrations/${id}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update registration.";
    return { success: false, error: message };
  }
}
