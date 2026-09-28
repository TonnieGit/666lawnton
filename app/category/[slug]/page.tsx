import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { getCollectionBySlug, getCollections, getProducts } from "@/lib/data";
import { readSort } from "@/lib/sort";
import { PRODUCTS_PER_PAGE } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};
  const isAll = slug === "all-products";
  return {
    title: isAll ? "Our antiques shop" : `${collection.name} | Antiques`,
    description: isAll
      ? "Hand-picked antiques that are funky, grungy and different, from 666 Tattoo & Antiques in Lawnton, North Brisbane."
      : `Shop ${collection.name.toLowerCase()} antiques from 666 Tattoo & Antiques in Lawnton, North Brisbane.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const sort = readSort(sp.sort);
  const page = Math.max(1, Number(sp.page) || 1);
  const [{ items, total }, collections] = await Promise.all([
    getProducts({ collectionSlug: slug, sort, limit: PRODUCTS_PER_PAGE, skip: (page - 1) * PRODUCTS_PER_PAGE }),
    getCollections(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const pageHref = (n: number) => {
    const q = new URLSearchParams();
    if (sort !== "newest") q.set("sort", sort);
    if (n > 1) q.set("page", String(n));
    const s = q.toString();
    return `/category/${slug}${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.25em] text-brass">Our antiques shop</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">{collection.name}</h1>

      {collections.length > 1 && (
        <nav aria-label="Categories" className="mt-8 -mx-4 overflow-x-auto px-4">
          <ul className="flex gap-2 whitespace-nowrap">
            {collections.map((c) => (
              <li key={c._id}>
                <Link
                  href={`/category/${c.slug}`}
                  aria-current={c.slug === slug ? "page" : undefined}
                  className="inline-block border border-bone/25 px-4 py-2 text-sm hover:border-bone aria-[current=page]:border-bone aria-[current=page]:bg-bone aria-[current=page]:text-ink"
                >
                  {c.name} <span className="opacity-70">({c.numberOfProducts})</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-bone/10 pb-4">
        <p className="text-sm text-muted" aria-live="polite">
          {total} {total === 1 ? "item" : "items"}
        </p>
        <Suspense>
          <SortSelect value={sort} />
        </Suspense>
      </div>

      <div className="mt-8">
        <h2 className="sr-only">Products</h2>
        {items.length ? (
          <ProductGrid products={items} priorityCount={4} />
        ) : (
          <p className="py-16 text-center text-muted">Nothing here right now. Check back soon.</p>
        )}
      </div>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(n)}
              aria-current={n === page ? "page" : undefined}
              aria-label={`Page ${n}`}
              className="grid size-10 place-items-center border border-bone/25 text-sm hover:border-bone aria-[current=page]:bg-bone aria-[current=page]:text-ink"
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
