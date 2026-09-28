# 666 Tattoo & Antiques — Headless Front End Spec

## 1. Overview

A new custom front end for **666 Tattoo & Antiques** (Lawnton, North Brisbane), currently hosted on Wix at https://www.666shoplawnton.com.

The goal is a pitch-ready demo on Vercel, built **without access to the client's Wix account**. All product and page content is scraped from the public site and stored as mock data that mirrors the **exact shape the Wix JavaScript SDK returns**. If the client approves, the mock data source is swapped for a live Wix Headless connection with minimal code changes.

### Phases

| Phase | Data source | Hosting | Outcome |
|---|---|---|---|
| 1. Demo build | Scraped mock data (Wix-shaped JSON) | Vercel preview URL, `noindex` | Client sees their real shop in the new design |
| 2. Connect | Live Wix Headless (client's site) | Vercel preview | Same site, live data, working cart and checkout |
| 3. Launch | Live Wix Headless | Vercel on client's domain | Domain DNS points to Vercel, Wix stays as backend |

This spec covers Phase 1 in detail and defines what Phase 2 and 3 need so Phase 1 doesn't create rework.

---

## 2. Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Wix SDK (installed from day one, used in Phase 2):** `@wix/sdk`, `@wix/stores`, `@wix/ecom`, `@wix/data`
- **Scraper:** Node + TypeScript script using `fetch` + `cheerio`. Playwright is a fallback only if content turns out to be client-rendered.
- **Hosting:** Vercel
- **Package manager:** pnpm (or npm, just be consistent)

---

## 3. Site Map & URL Parity

The new site **must keep the existing URL structure** so Google rankings and shared links survive launch.

| Page | Existing URL | New route |
|---|---|---|
| Home | `/` | `app/page.tsx` |
| About us | `/about-us` | `app/about-us/page.tsx` |
| Shop (all products) | `/category/all-products` | `app/category/[slug]/page.tsx` |
| Product detail | `/product-page/[slug]` | `app/product-page/[slug]/page.tsx` |
| Tattoo artists | `/portfolio` | `app/portfolio/page.tsx` |
| Artist pages | `/portfolio-collections/my-portfolio/[artist]` | `app/portfolio/[slug]/page.tsx` at `/portfolio/[artist]` (301 from old, seo.md §B3) |
| Tattoos (new) | — | `app/tattoos/page.tsx` |
| FAQ (new) | — | `app/faq/page.tsx` |
| Tattoo aftercare (new) | — | `app/tattoo-aftercare/page.tsx` |
| Gift vouchers (new) | — | `app/gift-vouchers/page.tsx` |
| Contact us | `/contact-us` | `app/contact-us/page.tsx` |
| Cart | (Wix side cart) | `app/cart/page.tsx` and slide-out drawer (`noindex`) |

Found by the scraper (`data/mock/scrape-report.json`) and handled by redirects in `next.config.ts`:

| Existing URL | Handling |
|---|---|
| `/category/{dolls,fine-art-ceramics,kitchen-decor,musical-instruments}` | Served by `app/category/[slug]` |
| `/portfolio-collections/my-portfolio` | 301 → `/portfolio` |
| `/book-online` ("Nothing to book right now") | 301 → `/contact-us` |

Any other URLs discovered by the scraper (for example extra categories or pages linked from the sitemap) are logged in the scrape report and added to this table before build.

---

## 4. Architecture: The Data Layer

All data access goes through one module. **Pages and components never import mock JSON or the Wix SDK directly.**

```
lib/
  data/
    index.ts          # Public API, picks the implementation by env var
    types.ts          # Wix-shaped types (raw) + app-level types
    mock/
      products.ts     # Reads data/mock/products.json
      collections.ts
      cms.ts          # Artists, site content
      cart.ts         # In-memory / localStorage cart for demo
    wix/
      client.ts       # createClient + OAuthStrategy
      products.ts     # products.queryProducts()
      collections.ts
      cms.ts          # @wix/data items.query()
      cart.ts         # @wix/ecom currentCart
```

### Public API (`lib/data/index.ts`)

```ts
getProducts(opts?: { collectionSlug?: string; sort?: SortKey; limit?: number; skip?: number }): Promise<{ items: WixProduct[]; total: number }>
getProductBySlug(slug: string): Promise<WixProduct | null>
getRelatedProducts(productId: string, limit?: number): Promise<WixProduct[]>
getCollections(): Promise<WixCollection[]>
getCollectionBySlug(slug: string): Promise<WixCollection | null>
getArtists(): Promise<ArtistItem[]>
getSiteContent(key: string): Promise<SiteContentItem | null>

// Cart
getCart(): Promise<Cart>
addToCart(productId: string, quantity: number, options?: Record<string, string>): Promise<Cart>
updateCartLine(lineId: string, quantity: number): Promise<Cart>
removeCartLine(lineId: string): Promise<Cart>
getCheckoutUrl(): Promise<string | null> // returns null in mock mode
```

Both implementations return **identical shapes**. The mock implementation must replicate SDK behaviour where it matters: slug lookup, `visible: false` filtering, collection filtering, sort order, pagination via `skip` / `limit`, and returning `null` for missing items.

### Environment variables

```
DATA_SOURCE=mock            # mock | wix
MOCK_MEDIA=remote           # remote | local (see §6.4)
NEXT_PUBLIC_WIX_CLIENT_ID=  # Phase 2
NEXT_PUBLIC_SITE_URL=       # used for canonical URLs and metadata
NEXT_PUBLIC_NOINDEX=true    # true on all preview deployments
```

---

## 5. Mock Data Format

Mock files live in `data/mock/` and are committed to the repo.

```
data/mock/
  products.json       # WixProduct[]
  collections.json    # WixCollection[]
  artists.json        # ArtistItem[] (Wix CMS item shape)
  site-content.json   # SiteContentItem[] (Wix CMS item shape)
  business.json       # Contact details, hours, socials
  scrape-report.json  # Generated, see §6.5
```

### 5.1 Product (Wix Stores catalog shape)

Match the object returned by `products.queryProducts()` in `@wix/stores`. Fields that can't be scraped get sensible defaults (noted below).

```json
{
  "_id": "generated-uuid",
  "name": "1930s NORITAKE Japanese made leaf shape serving dish",
  "slug": "1930s-noritake-japanese-made-leaf-shape-serving-dish",
  "visible": true,
  "productType": "physical",
  "description": "<p>Scraped HTML description</p>",
  "sku": "",
  "weight": 0,
  "stock": {
    "trackInventory": false,
    "inStock": true,
    "inventoryStatus": "IN_STOCK"
  },
  "price": {
    "currency": "AUD",
    "price": 119,
    "discountedPrice": 119,
    "formatted": { "price": "$119.00", "discountedPrice": "$119.00" }
  },
  "priceData": {
    "currency": "AUD",
    "price": 119,
    "discountedPrice": 119,
    "formatted": { "price": "$119.00", "discountedPrice": "$119.00" }
  },
  "priceRange": { "minValue": 119, "maxValue": 119 },
  "discount": { "type": "NONE", "value": 0 },
  "media": {
    "mainMedia": {
      "_id": "bfd742_xxxxxxxx~mv2.jpeg",
      "mediaType": "image",
      "title": "",
      "image": {
        "url": "https://static.wixstatic.com/media/bfd742_xxxxxxxx~mv2.jpeg",
        "width": 1000,
        "height": 1000
      },
      "thumbnail": {
        "url": "https://static.wixstatic.com/media/bfd742_xxxxxxxx~mv2.jpeg/v1/fit/w_50,h_50,q_90/file.jpg",
        "width": 50,
        "height": 50
      }
    },
    "items": []
  },
  "productOptions": [],
  "manageVariants": false,
  "customTextFields": [],
  "additionalInfoSections": [],
  "ribbon": "",
  "brand": "",
  "collectionIds": ["00000000-000000-000000-000000000001"],
  "productPageUrl": {
    "base": "https://www.666shoplawnton.com/",
    "path": "/product-page/1930s-noritake-japanese-made-leaf-shape-serving-dish"
  },
  "numericId": "",
  "lastUpdated": "ISO timestamp of scrape",
  "_createdDate": "ISO timestamp of scrape"
}
```

**Defaults for unscrapeable fields:**

- `_id`: deterministic UUID v5 generated from the slug, so IDs stay stable across re-scrapes.
- `stock`: `inStock` follows the page (sold-out badge or JSON-LD `availability`); `trackInventory: false` and no `quantity`.
- `sku`, `weight`, `numericId`, `brand`: empty unless present on the page.
- `collectionIds`: always includes the Wix "All Products" collection ID `00000000-000000-000000-000000000001`, plus IDs for any other categories found.
- `media.items`: every gallery image on the product page, with `mainMedia` repeated as the first item (matches Wix behaviour).
- `productOptions`: populated if the product page shows option selectors (size, colour, etc.). Most antiques will have none.

### 5.2 Collection

```json
{
  "_id": "00000000-000000-000000-000000000001",
  "name": "All Products",
  "slug": "all-products",
  "visible": true,
  "numberOfProducts": 0,
  "description": "",
  "media": { "mainMedia": null, "items": [] }
}
```

### 5.3 CMS items (artists and page content)

The About page copy and the tattoo artist portfolio are likely built directly in the Wix Editor, which the Wix API cannot read. They are modelled here as **Wix CMS collection items** so that in Phase 2 they can be created as CMS collections on the client's site and read with `@wix/data`.

**Collection `Artists`:**

```json
{
  "_id": "generated-uuid",
  "_createdDate": "ISO",
  "_updatedDate": "ISO",
  "title": "Artist name",
  "slug": "artist-name",
  "bio": "Plain text or rich text",
  "specialties": ["Traditional", "Blackwork"],
  "experience": "20+ years",
  "profileImage": "wix:image://v1/bfd742_xxx~mv2.jpg/file.jpg#originWidth=1000&originHeight=1000",
  "gallery": [
    { "type": "image", "src": "wix:image://v1/...", "title": "", "description": "" }
  ],
  "instagram": "",
  "bookingUrl": "",
  "sortOrder": 1
}
```

**Collection `SiteContent`** (one item per editable block, e.g. `home-hero`, `about-intro`):

```json
{
  "_id": "home-hero",
  "title": "666 Tattoo & Antiques",
  "body": "A unique blend of decades of tattoo expertise, a passion for antiques and a love of great coffee - all in one place.",
  "image": "wix:image://v1/...",
  "ctaLabel": "Chat to us now",
  "ctaHref": "/contact-us"
}
```

A helper `wixImageToUrl(src)` converts `wix:image://v1/...` strings into `https://static.wixstatic.com/media/...` URLs (this is what the Wix SDK's `media.getImageUrl()` does; use the SDK helper in Phase 2).

### 5.4 Business info (`business.json`)

```json
{
  "name": "666 Tattoo & Antiques",
  "phone": "0448 677 666",
  "email": "666shoplawnton@gmail.com",
  "address": {
    "street": "21/666 Gympie Road",
    "suburb": "Lawnton",
    "city": "Brisbane",
    "state": "QLD",
    "country": "Australia"
  },
  "hours": [],
  "socials": { "facebook": "666tattoolawnton", "instagram": "" }
}
```

Hours and Instagram handle are to be confirmed (not on the home page; check contact and footer during scrape).

---

## 6. Scraper

Location: `scripts/scrape/`. Run with `pnpm scrape`.

### 6.1 Rules

- Only scrape `666shoplawnton.com` and `static.wixstatic.com`.
- Rate limit: max 1 request per second, sequential.
- Identify with a descriptive User-Agent.
- Idempotent: re-running updates existing records (matched by slug) and keeps generated IDs stable.
- Never commit anything outside `data/mock/` and `public/mock-media/`.

### 6.2 Discovering URLs

1. Try `/sitemap.xml`. Wix sites usually expose sub-sitemaps, including one for store products and one for pages. Collect all `/product-page/*` URLs and page URLs.
2. Fallback: crawl `/category/all-products`, following pagination and "Load more" parameters until no new product links appear.
3. Log every discovered URL, and flag any that don't fit the route table in §3.

### 6.3 Extracting product data

For each product page, in order of preference:

1. **JSON-LD** (`<script type="application/ld+json">` with `@type: Product`): name, description, images, SKU, `offers.price`, `offers.priceCurrency`, `offers.availability`.
2. **Embedded Wix page data** (inline JSON in the server-rendered HTML): if present, use it for gallery image IDs, dimensions, options, and ribbons.
3. **DOM fallback** with cheerio selectors for name, price, description, and gallery images.

Record which method succeeded per product in the scrape report.

Prices are parsed as numbers (`"$119.00"` → `119`) and re-formatted with `Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })` for the `formatted` fields.

### 6.4 Images

- Normalise every Wix image URL to its **original** form by stripping the transform path:
  `https://static.wixstatic.com/media/bfd742_abc~mv2.jpeg/v1/fill/w_557,h_854,.../file.jpeg` → `https://static.wixstatic.com/media/bfd742_abc~mv2.jpeg`
- The mock JSON stores the original `static.wixstatic.com` URLs, exactly as Wix would return them.
- The scraper also downloads each original to `public/mock-media/{mediaId}` as a backup.
- `MOCK_MEDIA=remote` (default) serves images from Wix's CDN. `MOCK_MEDIA=local` makes `resolveMediaUrl()` rewrite them to `/mock-media/{mediaId}`, which protects the demo if the client deletes or changes images before the pitch.
- Read real image dimensions from the downloaded file and store them in `width` / `height`.

### 6.5 Page content

Scrape Home, About, Portfolio, and Contact pages for headings, body text, image URLs, and artist details, and write them into `site-content.json` and `artists.json`. This part is semi-manual: the script extracts raw text and images into a draft file, and a person tidies it into the CMS item format.

### 6.6 Scrape report

`data/mock/scrape-report.json` includes a timestamp, counts (products, images, pages), extraction method per product, products with missing fields, failed URLs, and any URLs not covered by the route table.

---

## 7. Features & Page Requirements

### Global

- Header with logo, navigation matching the current site, and cart icon with item count.
- Footer with business info from `business.json`, a "Chat to us now" call to action, and socials.
- Responsive from 360 px wide up.
- `next/image` everywhere, with a custom loader for `static.wixstatic.com` that requests correctly sized Wix transforms (`/v1/fill/w_{w},h_{h},al_c,q_85/file.jpg`).

### Home

- Hero from `SiteContent: home-hero`.
- Featured antiques grid (latest 8 products).
- Introduction to the three sides of the business: tattoo, antiques, coffee.
- Artists teaser linking to `/portfolio`.
- Location / contact block.

### Shop (`/category/[slug]`)

- Product grid showing image, name, price, and a sold-out badge.
- Sort: newest, price low–high, price high–low, name A–Z.
- Pagination or "load more" (24 per page).
- Category filter if more than one collection is found.

### Product detail (`/product-page/[slug]`)

- Image gallery with thumbnails and zoom/lightbox.
- Name, price (showing discount if applicable), description (sanitised HTML), additional info sections.
- Options selector if `productOptions` exist.
- Quantity selector, capped at 1 for one-off antiques if stock tracking is off (confirm with client).
- Add to cart.
- Related products (same collection, excluding current).
- `Product` JSON-LD structured data.
- `generateStaticParams` for all slugs, with ISR revalidation in Phase 2.

### Portfolio (`/portfolio`)

- Artist cards from `Artists`, each with profile image, bio, specialties, and gallery (lightbox).
- Booking / enquiry call to action per artist.

### About (`/about-us`)

- Content from `SiteContent` items.

### Contact (`/contact-us`)

- Business details, embedded map, and a contact form.
- **Phase 1:** the form validates and shows a success message, but does not send anything (clearly flagged in code).
- **Phase 2:** send via Wix Forms API or a service like Resend (decide with the client).

### Cart & checkout

- **Phase 1 (mock):** cart stored in `localStorage`, fully working add / update / remove. The checkout button is disabled with the note "Checkout available once connected to your store." No payment flow in the demo.
- **Phase 2 (live):** `@wix/ecom` current cart, then redirect to Wix-hosted checkout via a redirect session. Add the Vercel preview and production domains to the headless client's allowed redirect domains.

---

## 8. SEO

- Per-page `metadata` (title, description, Open Graph) matching or improving on the current site.
- Canonical URLs built from `NEXT_PUBLIC_SITE_URL`.
- `robots.txt` and `<meta name="robots" content="noindex, nofollow">` on all preview deployments when `NEXT_PUBLIC_NOINDEX=true`.
- `sitemap.xml` generated from products and pages (enabled only at launch).
- `LocalBusiness` JSON-LD on the home and contact pages.

---

## 9. Design Direction

To be confirmed with a moodboard before build. Starting points:

- The brand combines three things: tattoo studio, antiques shop, and coffee. The design should feel like one place with character, not three separate businesses.
- Reuse the existing logo (scraped) until the client supplies originals.
- Product photography varies in quality, so the product grid should use a consistent aspect ratio with `object-fit: cover` and a neutral background.
- Accessibility: WCAG 2.1 AA contrast, keyboard navigation, alt text (use product names when images have no alt).

---

## 10. Phase 2: Connecting to the Client's Wix Site

1. Client invites the developer as a collaborator on their Wix site.
2. Check which **Wix Stores catalog version** the site uses (V1 `products` vs V3 `productsV3`). If it's V3, update `lib/data/wix/products.ts` to map V3 responses into the V1-style `WixProduct` type used by the app. Pages don't change.
3. Create a headless OAuth client in the Wix dashboard. Add `localhost`, the Vercel preview domain, and the production domain as allowed domains.
4. Create CMS collections `Artists` and `SiteContent` with the fields in §5.3, and import `artists.json` / `site-content.json`.
5. Set `DATA_SOURCE=wix` and `NEXT_PUBLIC_WIX_CLIENT_ID`.
6. Compare every page against the mock version. The scrape report's slug list doubles as a checklist.
7. Test cart and redirect to checkout. **Don't complete a real payment** unless agreed with the client.
8. Confirm the client's Wix premium plan stays active (store and payments run on it).

## 11. Phase 3: Launch

1. Final client sign-off on the live-data preview.
2. Set `NEXT_PUBLIC_NOINDEX=false` on production, enable the sitemap.
3. Point the domain at Vercel (update DNS records; if the domain was bought through Wix, edit DNS in the Wix dashboard).
4. Add redirects for any URL that changed.
5. Submit the new sitemap in Google Search Console.
6. Decide with the client what happens to the old Wix-rendered site (unpublish once the new front end is live and the store is confirmed working through the API).

---

## 12. Milestones & Acceptance Criteria

| # | Milestone | Done when |
|---|---|---|
| M1 | Project scaffold | Next.js + TS + Tailwind running, data layer interfaces and types in place, `DATA_SOURCE=mock` works with a fixture product |
| M2 | Scraper | `pnpm scrape` produces `products.json` covering 100% of live products, all images downloaded, scrape report shows no failed URLs |
| M3 | Shop | Shop and product pages render every scraped product; prices and images match the live site |
| M4 | Content pages | Home, About, Portfolio, Contact built from mock CMS data |
| M5 | Cart | Mock cart works across pages and survives refresh; checkout disabled with message |
| M6 | Polish | Lighthouse ≥ 90 for Performance, Accessibility, SEO on mobile; no console errors |
| M7 | Demo deploy | Live on Vercel preview with `noindex`; link sent to client |

---

## 13. Open Questions

- Opening hours, Instagram handles (business and per artist), and booking process for tattoos.
- Are antiques always one-off items (quantity always 1)?
- Does the client want online payments at launch, or "enquire to buy" for some items?
- Coffee: menu, pricing, or just a mention?
- Does the client have original logo files and better photography?
- Contact form destination (email address, Wix Forms, or other).
