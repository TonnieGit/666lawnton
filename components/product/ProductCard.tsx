import Link from "next/link";
import type { WixProduct } from "@/lib/data/types";
import { WixImage } from "@/components/WixImage";
import { Price } from "./Price";

export function ProductCard({ product, priority = false }: { product: WixProduct; priority?: boolean }) {
  const img = product.media.mainMedia?.image;
  const soldOut = !product.stock.inStock;
  return (
    <Link href={`/product-page/${product.slug}`} className="group block">
      {/* Consistent square crop on a neutral ground: photography varies a lot (spec §9). */}
      <div className="relative aspect-square overflow-hidden bg-bone-2">
        <WixImage
          image={img}
          alt={img?.altText || product.name}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
          priority={priority}
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${soldOut ? "opacity-60 grayscale" : ""}`}
        />
        {(soldOut || product.ribbon) && (
          <span
            className={`absolute left-2 top-2 px-2 py-1 text-[11px] font-bold uppercase tracking-wider ${
              soldOut ? "bg-ink text-bone" : "bg-blood text-white"
            }`}
          >
            {soldOut ? "Sold out" : product.ribbon}
          </span>
        )}
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm leading-snug group-hover:underline">{product.name}</h3>
      <Price product={product} className="mt-1 text-sm font-semibold" />
    </Link>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: WixProduct[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <li key={p._id}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
