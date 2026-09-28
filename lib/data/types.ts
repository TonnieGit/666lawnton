// Wix-shaped types. These mirror what the Wix JavaScript SDK returns
// (@wix/stores V1 catalog, @wix/data CMS items) so the mock and live
// implementations are interchangeable. Keep optional fields optional:
// the SDK omits them rather than returning null.

export const ALL_PRODUCTS_COLLECTION_ID = "00000000-000000-000000-000000000001";

// ---------- Stores: products ----------

export interface WixFormattedPrice {
  price: string;
  discountedPrice: string;
  pricePerUnit?: string;
}

export interface WixPriceData {
  currency: string;
  price: number;
  discountedPrice: number;
  formatted: WixFormattedPrice;
  pricePerUnit?: number;
}

export interface WixMediaImage {
  url: string;
  width: number;
  height: number;
  format?: string;
  altText?: string | null;
}

export interface WixMediaItem {
  _id: string;
  mediaType: "image" | "video" | "audio" | "document" | "zip" | "UNSPECIFIED_MEDIA_TYPE_ITEM";
  title: string;
  image?: WixMediaImage;
  thumbnail?: WixMediaImage;
  video?: { files: WixMediaImage[]; stillFrameMediaId?: string };
}

export interface WixProductMedia {
  mainMedia?: WixMediaItem | null;
  items: WixMediaItem[];
}

export interface WixStock {
  trackInventory: boolean;
  quantity?: number;
  inStock: boolean;
  inventoryStatus: "IN_STOCK" | "OUT_OF_STOCK" | "PARTIALLY_OUT_OF_STOCK";
}

export interface WixProductOptionChoice {
  value: string;
  description: string;
  inStock: boolean;
  visible: boolean;
  media?: WixProductMedia;
}

export interface WixProductOption {
  optionType: "drop_down" | "color" | "unspecified_option_type";
  name: string;
  choices: WixProductOptionChoice[];
}

export interface WixAdditionalInfoSection {
  title: string;
  description: string; // HTML
}

export interface WixCustomTextField {
  title: string;
  maxLength: number;
  mandatory: boolean;
}

export interface WixProduct {
  _id: string;
  name: string;
  slug: string;
  visible: boolean;
  productType: "physical" | "digital" | "unspecified_product_type";
  description: string; // HTML
  sku: string;
  weight: number;
  stock: WixStock;
  price: WixPriceData;
  priceData: WixPriceData;
  priceRange: { minValue: number; maxValue: number };
  discount: { type: "NONE" | "AMOUNT" | "PERCENT" | "UNDEFINED"; value: number };
  media: WixProductMedia;
  productOptions: WixProductOption[];
  manageVariants: boolean;
  customTextFields: WixCustomTextField[];
  additionalInfoSections: WixAdditionalInfoSection[];
  ribbon: string;
  brand: string;
  collectionIds: string[];
  productPageUrl: { base: string; path: string };
  numericId: string;
  seoData?: { tags: { type: string; props?: Record<string, string>; children?: string }[] };
  lastUpdated: string;
  _createdDate: string;
}

// ---------- Stores: collections ----------

export interface WixCollection {
  _id: string;
  name: string;
  slug: string;
  visible: boolean;
  numberOfProducts: number;
  description: string;
  media: { mainMedia: WixMediaItem | null; items: WixMediaItem[] };
}

// ---------- CMS (@wix/data) items ----------

/** `wix:image://v1/{mediaId}/{filename}#originWidth=..&originHeight=..` */
export type WixImageRef = string;

export interface WixGalleryItem {
  type: "image" | "video";
  src: WixImageRef;
  title: string;
  description: string;
  /** Tattoo style, used for alt text (seo.md §B6). Empty until the client fills it in. */
  style?: string;
}

export interface ArtistItem {
  _id: string;
  _createdDate: string;
  _updatedDate: string;
  title: string;
  slug: string;
  bio: string;
  specialties: string[];
  /** Short, as stated in the bio: "20+ years", "Since 2017", "Apprentice". Optional. */
  experience?: string;
  profileImage: WixImageRef;
  gallery: WixGalleryItem[];
  instagram: string;
  bookingUrl: string;
  sortOrder: number;
}

export interface SiteContentItem {
  _id: string;
  title: string;
  body: string;
  image?: WixImageRef;
  ctaLabel?: string;
  ctaHref?: string;
}

// ---------- Business info (static JSON in both modes) ----------

export interface BusinessHours {
  day: string;
  open: string | null; // "09:00", null = closed
  close: string | null;
}

export interface BusinessInfo {
  name: string;
  phone: string;
  /** +61… for tel: links and structured data. */
  phoneE164: string;
  email: string;
  address: {
    street: string;
    suburb: string;
    city: string;
    state: string;
    postcode?: string;
    country: string;
  };
  hours: BusinessHours[];
  geo: { latitude: number; longitude: number } | null;
  licenceNumber: string;
  priceRange: string;
  logo: string;
  images: string[];
  areaServed: string[];
  /** Nearby suburbs mentioned in body copy (no doorway pages, seo.md §B1). */
  catchment: string[];
  socials: { facebook: string; instagram: string; tiktok?: string };
}

// ---------- App-level types ----------

export type SortKey = "newest" | "price_asc" | "price_desc" | "name_asc";

export interface GetProductsOptions {
  collectionSlug?: string;
  sort?: SortKey;
  limit?: number;
  skip?: number;
}

export interface ProductsResult {
  items: WixProduct[];
  total: number;
}

export interface CartLine {
  _id: string;
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  options: Record<string, string>;
  price: WixPriceData;
  image?: WixMediaImage;
  /** Stock limit when inventory is tracked (one-off antiques are usually 1). */
  maxQuantity?: number;
}

export interface Cart {
  lines: CartLine[];
  currency: string;
  subtotal: { amount: number; formatted: string };
  itemCount: number;
}

/** What each implementation (mock | wix) must provide for catalog + CMS. */
export interface CatalogSource {
  getProducts(opts?: GetProductsOptions): Promise<ProductsResult>;
  getProductBySlug(slug: string): Promise<WixProduct | null>;
  getRelatedProducts(productId: string, limit?: number): Promise<WixProduct[]>;
  getCollections(): Promise<WixCollection[]>;
  getCollectionBySlug(slug: string): Promise<WixCollection | null>;
  getArtists(): Promise<ArtistItem[]>;
  getSiteContent(key: string): Promise<SiteContentItem | null>;
}

/** What each cart implementation must provide. Runs in the browser. */
export interface CartSource {
  getCart(): Promise<Cart>;
  addToCart(productId: string, quantity: number, options?: Record<string, string>): Promise<Cart>;
  updateCartLine(lineId: string, quantity: number): Promise<Cart>;
  removeCartLine(lineId: string): Promise<Cart>;
  getCheckoutUrl(): Promise<string | null>;
}
