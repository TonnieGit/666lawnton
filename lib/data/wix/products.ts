// Phase 2: Wix Stores catalog V1. If the client's site is on catalog V3
// (spec §10 step 2), map productsV3 responses into WixProduct here — pages don't change.
import { ALL_PRODUCTS_COLLECTION_ID, type GetProductsOptions, type ProductsResult, type WixProduct } from "../types";
import { getWixServerClient } from "./client";
import { getCollectionBySlug } from "./collections";

const asProduct = (p: unknown) => p as WixProduct;

export async function getProducts(opts: GetProductsOptions = {}): Promise<ProductsResult> {
  const { collectionSlug, sort = "newest", limit = 100, skip = 0 } = opts;
  const wix = getWixServerClient();
  let query = wix.products.queryProducts().skip(skip).limit(limit);

  if (collectionSlug) {
    const collection = await getCollectionBySlug(collectionSlug);
    if (!collection) return { items: [], total: 0 };
    query = query.hasSome("collectionIds", [collection._id]);
  }

  switch (sort) {
    case "price_asc":
      query = query.ascending("price");
      break;
    case "price_desc":
      query = query.descending("price");
      break;
    case "name_asc":
      query = query.ascending("name");
      break;
    default:
      query = query.descending("lastUpdated");
  }

  const res = await query.find();
  return { items: res.items.map(asProduct), total: res.totalCount ?? res.items.length };
}

export async function getProductBySlug(slug: string): Promise<WixProduct | null> {
  const res = await getWixServerClient().products.queryProducts().eq("slug", slug).limit(1).find();
  return res.items[0] ? asProduct(res.items[0]) : null;
}

export async function getRelatedProducts(productId: string, limit = 4): Promise<WixProduct[]> {
  const wix = getWixServerClient();
  const res = await wix.products.queryProducts().eq("_id", productId).limit(1).find();
  const product = res.items[0];
  if (!product) return [];
  const ids = (product.collectionIds ?? []).filter((id) => id !== ALL_PRODUCTS_COLLECTION_ID);
  const related = await wix.products
    .queryProducts()
    .hasSome("collectionIds", ids.length ? ids : [ALL_PRODUCTS_COLLECTION_ID])
    .ne("_id", productId)
    .descending("lastUpdated")
    .limit(limit)
    .find();
  return related.items.map(asProduct);
}
