import Link from "next/link";

type Variant = "primary" | "outline";

/** Shared button look, for links, <button>s and form submits alike. */
export function buttonClass(variant: Variant = "primary", size: "md" | "sm" = "md") {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const sizes = size === "md" ? "px-6 py-3 text-sm" : "px-4 py-2 text-sm";
  const styles =
    variant === "primary"
      ? "bg-blood text-white hover:bg-blood/90"
      : "border border-bone/30 hover:border-bone hover:bg-bone hover:text-ink";
  return `${base} ${sizes} ${styles}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
}) {
  return (
    <Link href={href} className={buttonClass(variant)}>
      {children}
    </Link>
  );
}

/** CMS body text: blank lines separate paragraphs. */
export function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className={className}>
            {p}
          </p>
        ))}
    </>
  );
}
