import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses Row Level Security. NEVER import this into
 * anything that ships to the browser; it's for trusted server-side admin
 * mutations only (Server Actions under app/admin/**), gated separately by
 * the auth check in app/admin/layout.tsx + middleware.ts.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
