import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { StudentRegistration, RegistrationStatusHistory } from "@/lib/types";

export async function getRegistrations(includeDeleted: boolean = false): Promise<StudentRegistration[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  
  let query = supabase.from("registrations").select("*");
  if (!includeDeleted) {
    query = query.is("deleted_at", null);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    registrationNo: row.registration_no,
    studentName: row.student_name,
    parentName: row.parent_name,
    mobile: row.mobile,
    email: row.email || undefined,
    dob: row.dob,
    age: row.age,
    joiningDate: row.joining_date,
    danceStyle: row.dance_style,
    batchTime: row.batch_time,
    package: row.package,
    paymentMode: row.payment_mode,
    batchDays: row.batch_days,
    emergencyContact: row.emergency_contact || undefined,
    medicalCondition: row.medical_condition || undefined,
    notes: row.notes || undefined,
    agreement: row.agreement,
    paymentStatus: row.payment_status,
    status: row.status,
    viewed: row.viewed,
    internalNotes: row.internal_notes || undefined,
    deletedAt: row.deleted_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getRegistrationById(id: string): Promise<StudentRegistration | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("registrations").select("*").eq("id", id).single();
  if (error || !data) return null;

  return {
    id: data.id,
    registrationNo: data.registration_no,
    studentName: data.student_name,
    parentName: data.parent_name,
    mobile: data.mobile,
    email: data.email || undefined,
    dob: data.dob,
    age: data.age,
    joiningDate: data.joining_date,
    danceStyle: data.dance_style,
    batchTime: data.batch_time,
    package: data.package,
    paymentMode: data.payment_mode,
    batchDays: data.batch_days,
    emergencyContact: data.emergency_contact || undefined,
    medicalCondition: data.medical_condition || undefined,
    notes: data.notes || undefined,
    agreement: data.agreement,
    paymentStatus: data.payment_status,
    status: data.status,
    viewed: data.viewed,
    internalNotes: data.internal_notes || undefined,
    deletedAt: data.deleted_at || null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getRegistrationHistory(registrationId: string): Promise<RegistrationStatusHistory[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registration_status_history")
    .select("*")
    .eq("registration_id", registrationId)
    .order("created_at", { ascending: true });
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    registrationId: row.registration_id,
    changedBy: row.changed_by,
    oldStatus: row.old_status,
    newStatus: row.new_status,
    oldPaymentStatus: row.old_payment_status,
    newPaymentStatus: row.new_payment_status,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
  }));
}
