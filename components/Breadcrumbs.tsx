import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/structured-data";

/** Visible breadcrumbs + matching BreadcrumbList JSON-LD (seo.md §B5). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-x-2 gap-y-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className={i ? "before:mr-2 before:content-['›']" : ""}>
                {last ? (
                  <span aria-current="page" className="text-bone/80">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.href} className="hover:text-bone">
                    {c.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
