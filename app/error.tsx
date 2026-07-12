"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-4 text-center">
      <h1 className="font-display text-3xl text-ink">Something Went Wrong</h1>
      <p className="max-w-md text-sm text-ink-muted">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button onClick={reset} className="btn-solid">
        Try Again
      </button>
    </div>
  );
}
