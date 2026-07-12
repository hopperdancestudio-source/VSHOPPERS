import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-4 pt-nav-h text-center">
      <p className="font-display text-8xl text-accent">404</p>
      <h1 className="font-display text-3xl text-ink">Page Not Found</h1>
      <p className="max-w-md text-sm text-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn-solid">
        Back Home
      </Link>
    </div>
  );
}
