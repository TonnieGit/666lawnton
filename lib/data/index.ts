// Public data API (spec §4). Pages and components import from here only —
// never from data/mock/*.json or @wix/* directly.
//
// Catalog + CMS reads run on the server. The cart runs in the browser
// (localStorage in mock mode, visitor tokens in Wix mode), so it lives in
// `lib/data/cart.ts` to keep server-only code out of client bundles.

import type { CatalogSource } from "./types";
import * as mockProducts from "./mock/products";
import * as mockCollections from "./mock/collections";
import * as mockCms from "./mock/cms";
import * as wixProducts from "./wix/products";
import * as wixCollections from "./wix/collections";
import * as wixCms from "./wix/cms";

export type * from "./types";
export { ALL_PRODUCTS_COLLECTION_ID } from "./types";

export const dataSource: "mock" | "wix" = process.env.DATA_SOURCE === "wix" ? "wix" : "mock";

const source: CatalogSource =
  dataSource === "wix"
    ? { ...wixProducts, ...wixCollections, ...wixCms }
    : { ...mockProducts, ...mockCollections, ...mockCms };

export const getProducts = source.getProducts;
export const getProductBySlug = source.getProductBySlug;
export const getRelatedProducts = source.getRelatedProducts;
export const getCollections = source.getCollections;
export const getCollectionBySlug = source.getCollectionBySlug;
export const getArtists = source.getArtists;
export const getSiteContent = source.getSiteContent;

export { getBusinessInfo } from "./business";
