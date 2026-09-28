import Link from "next/link";

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  const styles =
    variant === "primary"
      ? "bg-blood text-white hover:bg-blood/90"
      : "border border-bone/40 hover:bg-bone hover:text-ink";
  return (
    <Link
      href={href}
      className={`inline-block px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${styles}`}
    >
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
