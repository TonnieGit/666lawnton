import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Crumb } from "@/lib/structured-data";

/** Small tracked-out label above a heading. */
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs uppercase tracking-[0.3em] text-brass ${className}`}>{children}</p>;
}

/**
 * Full-width band with the standard inner container. Pages alternate ink and
 * light bands down the page, like the home page (globals.css .surface-light).
 */
export function Section({
  tone = "ink",
  width = "wide",
  className = "",
  children,
  ...rest
}: {
  tone?: "ink" | "light";
  width?: "wide" | "narrow";
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"section">, "className" | "children">) {
  return (
    <section className={`${tone === "light" ? "surface-light" : ""} py-20 md:py-24 ${className}`} {...rest}>
      <div className={`mx-auto px-4 ${width === "narrow" ? "max-w-3xl" : "max-w-6xl"}`}>{children}</div>
    </section>
  );
}

/**
 * Inner-page opener: breadcrumbs, eyebrow, large title and intro, with an
 * optional image or panel alongside. Never wrapped in .reveal (LCP).
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  children,
  aside,
  width = "wide",
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  width?: "wide" | "narrow";
}) {
  return (
    <header className={`mx-auto px-4 pb-16 pt-8 md:pb-24 md:pt-12 ${width === "narrow" ? "max-w-3xl" : "max-w-6xl"}`}>
      <Breadcrumbs items={crumbs} />
      {/* items-start: centring would nudge the image when the web font swaps in (CLS). */}
      <div className={`mt-8 grid items-start gap-10 ${aside ? "md:grid-cols-[1.15fr_0.85fr] md:gap-14" : ""}`}>
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className={`font-display text-5xl leading-[0.95] md:text-6xl lg:text-7xl ${eyebrow ? "mt-4" : ""}`}>{title}</h1>
          {children && <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-bone/85">{children}</div>}
        </div>
        {aside}
      </div>
    </header>
  );
}
