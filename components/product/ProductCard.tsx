import Link from "next/link";
import type { WixProduct } from "@/lib/data/types";
import { WixImage } from "@/components/WixImage";
import { Price } from "./Price";

type HeadingLevel = "h2" | "h3";

export function ProductCard({
  product,
  priority = false,
  headingLevel: H = "h3",
}: {
  product: WixProduct;
  priority?: boolean;
  headingLevel?: HeadingLevel;
}) {
  const img = product.media.mainMedia?.image;
  const sold = !product.stock.inStock;
  return (
    <Link href={`/product-page/${product.slug}`} className="group block">
      {/* Consistent square crop on a neutral ground: photography varies a lot (spec §9). */}
      <div className="relative aspect-square overflow-hidden bg-bone-2">
        <WixImage
          image={img}
          alt={img?.altText || product.name}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
          priority={priority}
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${sold ? "opacity-60 grayscale" : ""}`}
        />
        {(sold || product.ribbon) && (
          <span
            className={`absolute left-2 top-2 px-2 py-1 text-[11px] font-bold uppercase tracking-wider ${
              sold ? "bg-ink text-bone" : "bg-blood text-white"
            }`}
          >
            {sold ? "Sold" : product.ribbon}
          </span>
        )}
      </div>
      <H className="mt-3 line-clamp-2 text-sm leading-snug group-hover:underline">{product.name}</H>
      <Price product={product} className="mt-1 text-sm font-semibold" />
    </Link>
  );
}

export function ProductGrid({
  products,
  priorityCount = 0,
  headingLevel = "h3",
}: {
  products: WixProduct[];
  priorityCount?: number;
  headingLevel?: HeadingLevel;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        // Cards past the first rows skip rendering (and image fetches) until scrolled near.
        <li key={p._id} className={i >= 4 ? "[contain-intrinsic-size:auto_320px] [content-visibility:auto]" : undefined}>
          <ProductCard product={p} priority={i < priorityCount} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
