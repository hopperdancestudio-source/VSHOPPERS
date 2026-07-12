"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (signInError) {
      setError("Invalid email or password.");
      return;
    }

    router.push(searchParams.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-line bg-black px-8 py-10"
      >
        <span className="mb-8 block h-6 w-6 bg-accent" aria-hidden />
        <h1 className="font-display text-2xl text-ink">Admin Sign In</h1>
        <p className="mt-2 text-sm text-ink-muted">Studio content management</p>

        <div className="mt-8 flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-white/15 bg-bg-raised px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-white/15 bg-bg-raised px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-accent">{error}</p>}

        <button type="submit" disabled={loading} className="btn-solid mt-8 w-full disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
