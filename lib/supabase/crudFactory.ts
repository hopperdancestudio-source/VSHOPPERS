import "server-only";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toSnakeCaseKeys } from "@/lib/supabase/caseUtils";
import type { ActionResult } from "@/components/admin/SimpleListEditor";

/**
 * Builds create/update/delete Server Actions for a simple Supabase table,
 * revalidating both the admin page and the public page(s) that read it so
 * changes show up immediately without a redeploy.
 *
 * Each returned function opens with its own `"use server"` directive so it
 * qualifies as a Server Action even though this module itself isn't a
 * `"use server"` file (which would require every export to be async).
 */
export function makeCrudActions<T extends { id: string }>(table: string, revalidatePaths: string[]) {
  async function create(data: Omit<T, "id">): Promise<ActionResult> {
    "use server";
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
    }
    const supabase = await createClient();
    const { error } = await supabase.from(table).insert(toSnakeCaseKeys(data));
    if (error) return { success: false, error: error.message };
    revalidatePaths.forEach((p) => revalidatePath(p));
    return { success: true };
  }

  async function update(id: string, data: Omit<T, "id">): Promise<ActionResult> {
    "use server";
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
    }
    const supabase = await createClient();
    const { error } = await supabase.from(table).update(toSnakeCaseKeys(data)).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePaths.forEach((p) => revalidatePath(p));
    return { success: true };
  }

  async function remove(id: string): Promise<ActionResult> {
    "use server";
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
    }
    const supabase = await createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePaths.forEach((p) => revalidatePath(p));
    return { success: true };
  }

  return { create, update, remove };
}
