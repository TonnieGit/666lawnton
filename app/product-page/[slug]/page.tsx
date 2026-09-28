import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AddToCart } from "@/components/product/AddToCart";
import { Price } from "@/components/product/Price";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductCard";
import { ProductNotes } from "@/components/product/ProductNotes";
import { getCollections, getProductBySlug, getProducts, getRelatedProducts } from "@/lib/data";
import type { WixProduct } from "@/lib/data/types";
import { sanitizeRichText, toPlainText } from "@/lib/sanitize";
import { pageMetadata, wixOgImage } from "@/lib/seo";
import { fitTitle } from "@/lib/site";
import { productJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

// Phase 2 (live Wix data): pages regenerate at most hourly (ISR).
export const revalidate = 3600;

export async function generateStaticParams() {
  const { items } = await getProducts({ limit: 1000 });
  return items.map((p) => ({ slug: p.slug }));
}

/** Wix SEO description if set, else the description + location (seo.md §B4). */
function productDescription(p: WixProduct) {
  const seo = p.seoData?.tags.find((t) => t.props?.name === "description")?.props?.content;
  if (seo) return seo;
  const suffix = " Available at 666 Antiques, Lawnton.";
  const text = toPlainText(p.description, 150) || p.name;
  return `${text.replace(/[.…\s]+$/, "")}.${suffix}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const img = p.media.mainMedia?.image;
  return pageMetadata({
    title: fitTitle(p.name, " | 666 Antiques Lawnton"),
    description: productDescription(p),
    path: `/product-page/${p.slug}`,
    image: img ? { url: wixOgImage(img.url), width: 1200, height: 630, alt: p.name } : null,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, collections] = await Promise.all([getRelatedProducts(product._id, 8), getCollections()]);
  const category = collections.find((c) => c.slug !== "all-products" && product.collectionIds.includes(c._id));
  // Sold antiques stay live with a clear badge and similar items (seo.md §B7).
  const sold = !product.stock.inStock;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <JsonLd data={productJsonLd(product)} />
      <Breadcrumbs
        items={[
          { name: "Antiques", href: "/category/all-products" },
          ...(category ? [{ name: category.name, href: `/category/${category.slug}` }] : []),
          { name: product.name, href: `/product-page/${product.slug}` },
        ]}
      />

      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
        <ProductGallery items={product.media.items} name={product.name} />

        <div>
          {(sold || product.ribbon) && (
            <span
              className={`inline-block px-2 py-1 text-[11px] font-bold uppercase tracking-wider ${
                sold ? "bg-bone text-ink" : "bg-blood text-white"
              }`}
            >
              {sold ? "Sold" : product.ribbon}
            </span>
          )}
          <h1 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{product.name}</h1>
          <Price product={product} className={`mt-4 text-2xl ${sold ? "text-muted line-through" : ""}`} />
          {product.sku && <p className="mt-1 text-xs text-muted">SKU {product.sku}</p>}

          <div className="mt-8">
            {sold ? (
              <p className="border border-bone/20 p-4 text-bone/85">
                This piece has found a new home. Take a look at the similar items below.
              </p>
            ) : (
              <AddToCart product={product} />
            )}
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

          <ProductNotes sold={sold} />
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-20">
          <h2 id="related" className="font-display text-2xl md:text-3xl">
            {sold ? "Similar items" : `More ${category ? category.name.toLowerCase() : "antiques"} you might like`}
          </h2>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
