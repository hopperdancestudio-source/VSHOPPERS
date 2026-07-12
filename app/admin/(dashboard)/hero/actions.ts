"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toSnakeCaseKeys } from "@/lib/supabase/caseUtils";
import type { ActionResult } from "@/components/admin/SimpleListEditor";
import type { PageHeroConfig } from "@/lib/types";

export async function savePageHero(pageKey: string, data: Partial<PageHeroConfig>): Promise<ActionResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "Connect Supabase (see .env.example) to enable saving." };
  }
  const supabase = await createClient();
  
  const dbData = toSnakeCaseKeys(data);
  delete dbData.page_key;

  const { error } = await supabase
    .from("page_heroes")
    .upsert({ page_key: pageKey, ...dbData });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/classes");
  revalidatePath("/schedule");
  revalidatePath("/gallery");
  revalidatePath("/contact");
  revalidatePath("/admin/hero");

  return { success: true };
}
