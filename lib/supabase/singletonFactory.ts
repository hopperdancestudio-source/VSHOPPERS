import "server-only";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toSnakeCaseKeys } from "@/lib/supabase/caseUtils";
import type { ActionResult } from "@/components/admin/SimpleListEditor";

export function makeSingletonSaveAction<T extends object>(table: string, revalidatePaths: string[]) {
  async function save(data: T): Promise<ActionResult> {
    "use server";
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
    }
    const supabase = await createClient();
    const { error } = await supabase.from(table).upsert({ id: 1, ...toSnakeCaseKeys(data) });
    if (error) return { success: false, error: error.message };
    revalidatePaths.forEach((p) => revalidatePath(p));
    return { success: true };
  }
  return save;
}
