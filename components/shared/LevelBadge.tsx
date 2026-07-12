import clsx from "clsx";

export function LevelBadge({
  children,
  variant = "outline",
}: {
  children: React.ReactNode;
  variant?: "outline" | "solid" | "gold";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center border px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wide",
        variant === "outline" && "border-white/25 text-ink-muted",
        variant === "solid" && "border-accent bg-accent/15 text-accent",
        variant === "gold" && "border-gold/40 bg-gold/10 text-gold"
      )}
    >
      {children}
    </span>
  );
}
