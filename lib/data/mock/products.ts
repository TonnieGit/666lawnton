import productsJson from "@/data/mock/products.json";
import type { GetProductsOptions, ProductsResult, SortKey, WixProduct } from "../types";
import { getCollectionBySlug } from "./collections";

const allProducts = productsJson as unknown as WixProduct[];

// Wix only returns visible products to site visitors.
function visibleProducts(): WixProduct[] {
  return allProducts.filter((p) => p.visible);
}

const sorters: Record<SortKey, (a: WixProduct, b: WixProduct) => number> = {
  newest: (a, b) => b._createdDate.localeCompare(a._createdDate),
  price_asc: (a, b) => a.priceData.discountedPrice - b.priceData.discountedPrice,
  price_desc: (a, b) => b.priceData.discountedPrice - a.priceData.discountedPrice,
  name_asc: (a, b) => a.name.localeCompare(b.name, "en-AU", { sensitivity: "base" }),
};

export async function getProducts(opts: GetProductsOptions = {}): Promise<ProductsResult> {
  const { collectionSlug, sort = "newest", limit = 100, skip = 0 } = opts;
  let items = visibleProducts();

  if (collectionSlug) {
    const collection = await getCollectionBySlug(collectionSlug);
    if (!collection) return { items: [], total: 0 };
    items = items.filter((p) => p.collectionIds.includes(collection._id));
  }

  items = [...items].sort(sorters[sort]);
  return { items: items.slice(skip, skip + limit), total: items.length };
}

export async function getProductBySlug(slug: string): Promise<WixProduct | null> {
  return visibleProducts().find((p) => p.slug === slug) ?? null;
}

export async function getProductsByIds(ids: string[]): Promise<WixProduct[]> {
  return visibleProducts().filter((p) => ids.includes(p._id));
}

export async function getRelatedProducts(productId: string, limit = 4): Promise<WixProduct[]> {
  const product = visibleProducts().find((p) => p._id === productId);
  if (!product) return [];
  // Prefer a specific category over "All Products" when one exists.
  const specific = product.collectionIds.filter((id) => id !== "00000000-000000-000000-000000000001");
  const ids = specific.length ? specific : product.collectionIds;
  return visibleProducts()
    .filter((p) => p._id !== productId && p.collectionIds.some((id) => ids.includes(id)))
    .sort(sorters.newest)
    .slice(0, limit);
}
