import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { AddToCart } from "@/components/product/AddToCart";
import { Price } from "@/components/product/Price";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductCard";
import { getCollections, getProductBySlug, getProducts, getRelatedProducts } from "@/lib/data";
import { sanitizeRichText, toPlainText } from "@/lib/sanitize";
import { productJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

// Phase 2 (live Wix data): pages regenerate at most hourly (ISR).
export const revalidate = 3600;

export async function generateStaticParams() {
  const { items } = await getProducts({ limit: 1000 });
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const seoDescription = p.seoData?.tags.find((t) => t.props?.name === "description")?.props?.content;
  const description = seoDescription || toPlainText(p.description) || `${p.name} at 666 Tattoo & Antiques, Lawnton.`;
  const img = p.media.mainMedia?.image;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/product-page/${p.slug}` },
    openGraph: {
      title: p.name,
      description,
      images: img ? [{ url: img.url, width: img.width, height: img.height, alt: p.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, collections] = await Promise.all([getRelatedProducts(product._id, 4), getCollections()]);
  const category = collections.find((c) => c.slug !== "all-products" && product.collectionIds.includes(c._id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <JsonLd data={productJsonLd(product)} />

      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/category/all-products" className="hover:text-bone">
              Shop
            </Link>
          </li>
          {category && (
            <li className="before:mr-2 before:content-['/']">
              <Link href={`/category/${category.slug}`} className="hover:text-bone">
                {category.name}
              </Link>
            </li>
          )}
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
        <ProductGallery items={product.media.items} name={product.name} />

        <div>
          {product.ribbon && (
            <span className="inline-block bg-blood px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              {product.ribbon}
            </span>
          )}
          <h1 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{product.name}</h1>
          <Price product={product} className="mt-4 text-2xl" />
          {product.sku && <p className="mt-1 text-xs text-muted">SKU {product.sku}</p>}

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          {product.description && (
            <div
              className="prose-wix mt-10 border-t border-bone/10 pt-8 leading-relaxed text-bone/90"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(product.description) }}
            />
          )}

          {product.additionalInfoSections.length > 0 && (
            <div className="mt-8 divide-y divide-bone/10 border-y border-bone/10">
              {product.additionalInfoSections.map((s) => (
                <details key={s.title} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    {s.title}
                    <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div
                    className="prose-wix mt-3 text-sm text-bone/85"
                    dangerouslySetInnerHTML={{ __html: sanitizeRichText(s.description) }}
                  />
                </details>
              ))}
            </div>
          )}

          <p className="mt-8 text-sm text-muted">
            Want to see it in person? Visit us at the shop or{" "}
            <Link href="/contact-us" className="text-brass underline">
              get in touch
            </Link>
            .
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-20">
          <h2 id="related" className="font-display text-2xl md:text-3xl">
            You might also like
          </h2>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
