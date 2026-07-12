import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

interface CookieOption {
  path?: string;
  domain?: string;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | "lax" | "strict" | "none";
  expires?: Date;
}

/**
 * Server-side Supabase client, bound to the current request's cookies so
 * `supabase.auth.getUser()` reflects the signed-in admin user (if any).
 * Use this in Server Components, Route Handlers, and Server Actions.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: CookieOption;
          }>
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render — safe to ignore since
            // middleware.ts refreshes the session on every request anyway.
          }
        },
      },
    }
  );
}
