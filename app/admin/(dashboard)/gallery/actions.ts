"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toSnakeCaseKeys } from "@/lib/supabase/caseUtils";
import type { ActionResult } from "@/components/admin/SimpleListEditor";
import type { GalleryCategory, GalleryItemDb } from "@/lib/types";

const revalidatePaths = ["/admin/gallery", "/gallery", "/"];

// CATEGORY ACTIONS

export async function createCategory(data: Omit<GalleryCategory, "id">): Promise<ActionResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
  }
  const supabase = await createClient();
  
  // Auto slug generation if not provided or empty
  const slug = data.slug || data.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const { error } = await supabase
    .from("gallery_categories")
    .insert(toSnakeCaseKeys({ ...data, slug }));
    
  if (error) return { success: false, error: error.message };
  revalidatePaths.forEach((p) => revalidatePath(p));
  return { success: true };
}

export async function updateCategory(id: string, data: Omit<GalleryCategory, "id">): Promise<ActionResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
  }
  const supabase = await createClient();

  // Auto slug generation if empty
  const slug = data.slug || data.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const { error } = await supabase
    .from("gallery_categories")
    .update(toSnakeCaseKeys({ ...data, slug }))
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePaths.forEach((p) => revalidatePath(p));
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
  }
  const supabase = await createClient();

  // Check if category contains any items
  const { count, error: countError } = await supabase
    .from("gallery_items")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) return { success: false, error: countError.message };
  if (count && count > 0) {
    return {
      success: false,
      error: "This category contains gallery items. Move or delete them first.",
    };
  }

  const { error } = await supabase.from("gallery_categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  
  revalidatePaths.forEach((p) => revalidatePath(p));
  return { success: true };
}

export async function reorderCategories(ids: string[]): Promise<ActionResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
  }
  const supabase = await createClient();

  // Sequential updates for category sort_order
  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from("gallery_categories")
      .update({ sort_order: i })
      .eq("id", ids[i]);
    if (error) return { success: false, error: error.message };
  }

  revalidatePaths.forEach((p) => revalidatePath(p));
  return { success: true };
}

// GALLERY ITEM ACTIONS

export async function createGalleryItem(data: Omit<GalleryItemDb, "id">): Promise<ActionResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").insert(toSnakeCaseKeys(data));
  if (error) return { success: false, error: error.message };
  revalidatePaths.forEach((p) => revalidatePath(p));
  return { success: true };
}

export async function updateGalleryItem(id: string, data: Omit<GalleryItemDb, "id">): Promise<ActionResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").update(toSnakeCaseKeys(data)).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePaths.forEach((p) => revalidatePath(p));
  return { success: true };
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePaths.forEach((p) => revalidatePath(p));
  return { success: true };
}
