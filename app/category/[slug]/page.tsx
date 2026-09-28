import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { getCollectionBySlug, getCollections, getProducts } from "@/lib/data";
import { pageMetadata, wixOgImage } from "@/lib/seo";
import { readSort } from "@/lib/sort";
import { PRODUCTS_PER_PAGE } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};
  const isAll = slug === "all-products";
  const { items } = await getProducts({ collectionSlug: slug, limit: 1 });
  const img = items[0]?.media.mainMedia?.image;
  return pageMetadata({
    title: isAll ? "Antiques & Vintage Collectables | 666 Shop Lawnton" : `${collection.name} | Antiques & Vintage | 666 Lawnton`,
    description: isAll
      ? "Hand-picked antiques, vintage porcelain, glassware and oddities from our shop in Lawnton, North Brisbane. Browse online or visit in store."
      : `Shop ${collection.name.toLowerCase()} antiques and vintage finds from 666 Antiques in Lawnton, North Brisbane. Browse online or visit us in store.`,
    // Sort variants canonicalise to the plain URL; paginated pages self-canonicalise (seo.md §B3).
    path: `/category/${slug}${page > 1 ? `?page=${page}` : ""}`,
    image: img ? { url: wixOgImage(img.url), width: 1200, height: 630, alt: collection.name } : null,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const isAll = slug === "all-products";
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
      <Breadcrumbs
        items={[
          { name: "Antiques", href: "/category/all-products" },
          ...(isAll ? [] : [{ name: collection.name, href: `/category/${slug}` }]),
        ]}
      />
      <h1 className="mt-6 font-display text-4xl md:text-5xl">{isAll ? "Antiques & Vintage Finds" : collection.name}</h1>
      {/* TODO(client): shop intro drafted for the demo (seo.md §B2 antiques cluster). */}
      <p className="mt-4 max-w-3xl leading-relaxed text-bone/85">
        {isAll
          ? "A northside Brisbane antique shop with a difference: hand-picked vintage porcelain, glassware, collectables and oddities that are funky, grungy and different. Every piece is in our Lawnton shop, so browse online and come in to see it in person."
          : `${collection.name} from our antiques shop in Lawnton, North Brisbane. Most pieces are one of a kind, so if you love it, grab it.`}
      </p>

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
          <ProductGrid products={items} priorityCount={2} />
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
