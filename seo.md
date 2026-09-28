# 666 Tattoo & Antiques — SEO Audit & Build Requirements

Companion to `spec.md`. Part A is an audit of the current Wix site (www.666shoplawnton.com, reviewed 28 Sep 2026). Part B is the set of SEO requirements Claude in VS Code must follow when building the new front end. **Where this file and `spec.md` disagree on SEO matters, this file wins.**

---

# Part A — Audit of the Current Site

## A1. Summary

The site is small (5 main pages, ~16+ products, 4 artist pages) and has very little search visibility. Semrush (AU database) shows **13 organic keywords and roughly 350 estimated organic visits a month**. The owner's second site, `jimmytattoo.net`, shows 4 keywords and about 13 visits.

The biggest strengths are the business itself (a genuinely unusual tattoo + antiques + coffee combination on a busy road), strong social proof on Facebook (56k+ likes, 98% recommend on one page, 428 reviews on the other), and product pages that already have custom meta descriptions with location terms.

The top three problems:

1. **Almost no tattoo content.** The homepage, the most valuable page, barely mentions tattooing, styles, or services. There are no service pages at all, so the site can't rank for tattoo searches beyond its brand name.
2. **Inconsistent business identity across the web** (names, phone numbers, websites, licence numbers). This weakens local rankings in Google Maps and the local pack.
3. **Low-quality on-page basics:** generic titles, filename alt text, leftover Wix template text, missing postcode and opening hours.

Keyword volume and difficulty data could not be pulled for this audit. Keyword priorities in Part B are based on search landscape review and intent, and should be validated in Semrush before launch (see B2).

## A2. Business identity (NAP) inconsistencies

Local SEO depends on Google seeing the same Name, Address, Phone everywhere. Current state:

| Source | Name | Phone | Website | Other |
|---|---|---|---|---|
| Website | 666 Tattoo & Antiques (title tags say "666 Tattoo Antiques") | 0448 677 666 | 666shoplawnton.com | No postcode, no hours |
| Facebook (666tattoolawnton) | 666 Tattoo Lawnton | 0448 677 666 | 666shoplawnton.com | Licence 4654751, 98% recommend (39 reviews) |
| Facebook (jimmy666tattoo2) | Jimmy Tattoo Lawnton | 0448 677 666 | **jimmytattoo.net** | Licence 4616385, 96% recommend (428 reviews) |
| Instagram (@666tattoocafe) | 666 tattoo cafe | **0432 654 957** | — | |
| Instagram (@666tattoolawnton) | Linked from contact page | — | — | |
| TikTok (@jimmy666tattoo) | Jimmy 666 Tattoo | 0448 677 666 | — | |
| Fresha | Listed at 21/666 Gympie Rd, Lawnton QLD **4501** | +61 448 677 666 | — | |

**Actions for the client (outside the build, but include in the pitch):**
- Pick one canonical business name and use it everywhere. Recommended: **666 Tattoo & Antiques**.
- One primary phone number everywhere (confirm whether 0432 654 957 is still in use).
- Confirm which tattoo licence number is current and display it on the site.
- Decide what happens to `jimmytattoo.net`. If they control it, 301-redirect it to Jimmy's artist page on the new site so any authority it has flows to the main domain.
- Claim and fully complete the Google Business Profile (categories: Tattoo shop primary; Antique store and Coffee shop secondary), with hours, photos, and the website link.

## A3. On-page issues

| Page | Issue | Severity | Fix in new build |
|---|---|---|---|
| All | Site name in titles is "666 Tattoo Antiques" (missing "&") | Medium | Use "666 Tattoo & Antiques" consistently |
| Home | Title "Home \| 666 Tattoo Antiques" has no service or location keywords | High | Keyword-led title (B4) |
| Home | Meta description is one vague sentence | High | Rewrite with services, location, call to action |
| Home | Very little text; tattoo services not described | Critical | Add tattoo, antiques and coffee sections with real copy |
| Home, About | Images named and alt-texted "Screenshot 2024-11-07 at 2.22.14 PM.png" | Medium | Descriptive alt text |
| All | Social share image is the small logo on every page | Low | Per-page OG images (B6) |
| About | Typo "typs"; generic heading "What we're about" | Low | Fix copy; keyword-bearing H2s |
| Portfolio | Only four name links; no text about styles or booking | High | Artist cards with styles, bio, CTA |
| Artist pages | Leftover Wix template text "Create Your First Project … Manage Projects" visible on page | High | Removed by rebuild |
| Artist pages | Title/OG title just "Jimmy"; bio says "based in Lawnton or Brisbane" | Medium | Proper titles and cleaned bios |
| Artist pages | ~45 images with Facebook numeric filenames as alt text, no descriptions | High | Alt text from style/description fields |
| Artist pages | Deep URLs `/portfolio-collections/my-portfolio/{name}` | Low | New clean URLs + 301s (B3) |
| Contact | No postcode, no hours, no map, no licence number | High | Full NAP block, hours, embedded map |
| Contact | Only social links; phone not tap-to-call | Medium | `tel:` and `mailto:` links |
| Products | Typos in product names ("centry", "Fluer") | Low | Flag to client; don't silently change scraped data |
| Products | Descriptions range from good to one-liners | Medium | Template adds consistent condition/era/pickup info |

## A4. Technical notes

- Canonicals and meta descriptions are present on all pages checked (Wix handles this).
- URLs have no trailing slash. Keep that convention.
- Wix outputs heavy JavaScript; the new Next.js build should comfortably beat it on Core Web Vitals.
- No `LocalBusiness` structured data found in the page content reviewed. Product structured data likely exists (Wix Stores outputs it), and must be kept and improved.

## A5. Competitive landscape

- **"Tattoo + suburb" searches** in the area are dominated by directories (Fresha, Yellow Pages) and Google Maps results, not studio websites. That's an opportunity: few local studios have strong pages, so decent on-page SEO plus a well-run Google Business Profile can compete.
- **Closest direct competitor:** Method Art Collective / Method Tattoo Coffee Bar in Brendale, a few minutes away, runs the same tattoo-plus-coffee concept. Differentiate on antiques, 30+ years combined experience, and cover-up expertise.
- **Other nearby:** tattoo studios in Strathpine, Narangba, Kippa-Ring, Deception Bay; piercing studios in Strathpine.
- **"Antiques Brisbane"** is dominated by large multi-dealer centres (Camp Hill Antique Centre, Empire Revival, Southside Antiques Centre) and listicles. Don't compete head-on for city-wide terms. Win on **northside / Moreton Bay** terms and **item-level searches** (e.g. vintage Noritake), where individual product pages can rank.

---

# Part B — SEO Requirements for the Build

## B1. Target locations

Primary: **Lawnton**. Secondary (the realistic catchment): Strathpine, Petrie, Bray Park, Kallangur, Brendale, Warner, Murrumba Downs, North Lakes, Narangba, Albany Creek. Umbrella terms: **North Brisbane**, **Brisbane northside**, **Moreton Bay**.

**Do not create separate suburb landing pages** (e.g. `/tattoo-strathpine`). With one location, these are thin doorway pages that Google discounts. Instead, mention the catchment naturally in the homepage, tattoo page, and contact page ("a short drive from Strathpine, Petrie and North Lakes").

## B2. Keyword map

No volumes are included because they could not be retrieved for this audit. **Before launch, run this list through Semrush Keyword Overview (AU database)** and adjust priorities. Priority below reflects intent and relevance.

### Tattoo cluster (highest commercial value)

| Keyword | Intent | Priority | Target page |
|---|---|---|---|
| tattoo lawnton / tattoo shop lawnton | Transactional, local | High | Home, `/tattoos` |
| tattoo studio north brisbane / brisbane northside | Transactional | High | `/tattoos` |
| tattoo artist north brisbane | Transactional | High | `/portfolio` |
| tattoo strathpine / petrie / north lakes / kallangur | Transactional, local | High (via body copy, not separate pages) | `/tattoos`, Home |
| tattoo moreton bay | Transactional | Medium | `/tattoos` |
| cover up tattoo brisbane / north brisbane | Transactional | High (Jimmy's specialty, strong differentiator) | `/tattoos#cover-ups` section, Jimmy's page |
| japanese tattoo brisbane | Transactional | Medium | `/tattoos` styles section, artist pages |
| traditional tattoo brisbane | Transactional | Medium | as above |
| realism tattoo brisbane | Transactional | Medium | as above |
| tattoo gift voucher brisbane | Transactional | Medium | `/gift-vouchers` |
| tattoo aftercare / how to look after a new tattoo | Informational | Medium | `/tattoo-aftercare` |
| how much does a tattoo cost brisbane | Informational | Medium | `/faq` |
| 666 tattoo / 666 tattoo lawnton / jimmy tattoo lawnton | Navigational (brand) | High (must own) | Home, Jimmy's page |

### Antiques cluster

| Keyword | Intent | Priority | Target page |
|---|---|---|---|
| antique shop north brisbane / brisbane northside | Commercial, local | High | `/category/all-products` |
| antiques lawnton / antiques strathpine | Commercial, local | High | Shop, Home |
| antique shop moreton bay | Commercial, local | Medium | Shop |
| vintage shop north brisbane / retro collectables | Commercial | Medium | Shop |
| vintage noritake / noritake for sale australia | Transactional, item-level | Medium | Product pages, possible Noritake collection page if stock supports it |
| antique porcelain / vintage glassware brisbane | Commercial | Low–Medium | Shop, product pages |
| gothic antiques / oddities brisbane | Commercial, niche | Low (on-brand, low competition) | About, Shop intro |

### Coffee

| Keyword | Intent | Priority | Target page |
|---|---|---|---|
| cafe lawnton / coffee lawnton | Local | Medium | Home section, contact |
| coffee gympie road lawnton | Local | Low | Home, contact |

**Rule:** each keyword has one primary page. Don't target the same primary keyword with two pages.

## B3. Site structure & URLs

Keep existing URLs where they carry value, and add the missing content pages.

| Route | Purpose | Status |
|---|---|---|
| `/` | Home | Keep |
| `/about-us` | About | Keep |
| `/tattoos` | **New.** Tattoo services, styles, cover-ups, booking process, pricing guidance, catchment suburbs | New |
| `/portfolio` | Artist index | Keep |
| `/portfolio/[artist]` | Artist pages | **New URL**, 301 from old |
| `/category/all-products` | Antiques shop | Keep |
| `/product-page/[slug]` | Products | Keep |
| `/tattoo-aftercare` | **New.** Aftercare guide (also supports aftercare product sales in store) | New |
| `/gift-vouchers` | **New.** Tattoo gift vouchers (mentioned on About but has no page) | New |
| `/faq` | **New.** Pricing, deposits, age requirement (18+ in QLD), booking, cover-ups, walk-ins | New |
| `/contact-us` | Contact, hours, map | Keep |

**Redirect map (implement in `next.config.js` `redirects()`, permanent 301):**

```
/portfolio-collections/my-portfolio/jimmy    → /portfolio/jimmy
/portfolio-collections/my-portfolio/jeff     → /portfolio/jeff
/portfolio-collections/my-portfolio/lindsay  → /portfolio/lindsay
/portfolio-collections/my-portfolio/melanie  → /portfolio/melanie
/portfolio-collections/my-portfolio          → /portfolio
```

Add any other old URLs found by the scraper (check the Wix sitemap for blog posts or extra pages) to this map before launch.

**Update `spec.md` §3** with the new routes above.

**URL conventions:** lowercase, hyphenated, no trailing slash (`trailingSlash: false`), no query strings for indexable content. Shop sorting/pagination uses query params (`?sort=`, `?page=`) with canonical pointing to the unparameterised URL for sort variants; paginated pages self-canonicalise.

## B4. Titles, descriptions & H1s

Titles ≤ 60 characters, descriptions 140–160 characters. Implement with Next.js `metadata` / `generateMetadata`. Use a `title.template` of `%s | 666 Tattoo & Antiques` only where the page title leaves room; otherwise set absolute titles.

| Page | Title | Meta description | H1 |
|---|---|---|---|
| Home | Tattoo Studio, Antiques & Coffee in Lawnton \| 666 | Northside Brisbane tattoo studio with 30+ years' combined experience, plus hand-picked antiques and great coffee. 21/666 Gympie Rd, Lawnton. | Tattoos, Antiques & Coffee in Lawnton |
| Tattoos | Custom & Cover-Up Tattoos, North Brisbane \| 666 Tattoo | Traditional, Japanese, realism and cover-up tattoos by experienced artists in Lawnton, close to Strathpine, Petrie and North Lakes. Enquire now. | Custom Tattoos in North Brisbane |
| Portfolio | Tattoo Artists in North Brisbane \| 666 Tattoo Lawnton | Meet the tattoo artists at 666 Tattoo in Lawnton and browse their work across traditional, Japanese, realism and cover-up styles. | Our Tattoo Artists |
| Artist | {Name}, Tattoo Artist in Lawnton \| 666 Tattoo | Built from the artist's bio: years of experience, top styles, and a booking CTA. | {Name} |
| About | About 666 Tattoo & Antiques \| Lawnton, North Brisbane | Existing description, lightly edited (fine as is). | About 666 Tattoo & Antiques |
| Shop | Antiques & Vintage Collectables \| 666 Shop Lawnton | Hand-picked antiques, vintage porcelain, glassware and oddities from our shop in Lawnton, North Brisbane. Browse online or visit in store. | Antiques & Vintage Finds |
| Product | {Product name} \| 666 Antiques Lawnton (truncate name to fit 60) | Use existing Wix SEO description if scraped; else first 150 chars of description + " Available at 666 Antiques, Lawnton." | {Product name} |
| Aftercare | Tattoo Aftercare Guide \| 666 Tattoo Lawnton | How to look after your new tattoo, day by day, from the artists at 666 Tattoo in Lawnton, North Brisbane. | Tattoo Aftercare Guide |
| Gift vouchers | Tattoo Gift Vouchers \| 666 Tattoo Lawnton | Give the gift of ink. Tattoo gift vouchers available in any amount from 666 Tattoo in Lawnton, North Brisbane. | Tattoo Gift Vouchers |
| FAQ | Tattoo FAQs: Pricing, Booking & Cover-Ups \| 666 Tattoo | Answers on tattoo pricing, deposits, age rules, cover-ups and walk-ins at 666 Tattoo, Lawnton. | Frequently Asked Questions |
| Contact | Contact & Directions \| 666 Tattoo & Antiques Lawnton | Visit us at 21/666 Gympie Road, Lawnton QLD 4501, call 0448 677 666 or send a message. Opening hours, map and directions. | Get in Touch |

**Heading rules:** exactly one H1 per page. H2s describe sections using secondary keywords naturally (e.g. "Cover-Up Tattoos", "Japanese & Traditional Styles", "Our Antiques Shop", "Coffee While You Browse"). Never skip levels. The site logo is not an H1.

**Copy rules:** primary keyword in the first 100 words of each page; write for people first; no keyword stuffing; home and `/tattoos` should each have at least 300–500 words of real copy. Placeholder copy in the demo must be marked `TODO(client)` in code so it's replaced before launch.

## B5. Structured data (JSON-LD)

Render as `<script type="application/ld+json">` in server components. Validate with Google's Rich Results Test.

**Site-wide (`app/layout.tsx`) — LocalBusiness, multi-typed:**

```json
{
  "@context": "https://schema.org",
  "@type": ["TattooParlor", "Store", "CafeOrCoffeeShop"],
  "@id": "https://www.666shoplawnton.com/#business",
  "name": "666 Tattoo & Antiques",
  "url": "https://www.666shoplawnton.com",
  "logo": "…",
  "image": ["…storefront photo…"],
  "telephone": "+61448677666",
  "email": "666shoplawnton@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "21/666 Gympie Road",
    "addressLocality": "Lawnton",
    "addressRegion": "QLD",
    "postalCode": "4501",
    "addressCountry": "AU"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 0, "longitude": 0 },
  "openingHoursSpecification": [],
  "areaServed": ["Lawnton", "Strathpine", "Petrie", "North Lakes", "Kallangur", "Brendale", "Moreton Bay"],
  "sameAs": [
    "https://www.facebook.com/666tattoolawnton/",
    "https://www.instagram.com/666tattoolawnton/",
    "https://www.tiktok.com/@jimmy666tattoo"
  ],
  "priceRange": "$$"
}
```

Values for `geo`, `openingHoursSpecification`, `sameAs` and `image` live in `data/mock/business.json` and are marked `TODO(client)` until confirmed. Don't output empty arrays or zero coordinates in production; omit the property instead.

**Also:** `WebSite` (name + url) on the home page.

**Product pages — `Product`:**
- `name`, `description`, `image` (all gallery images), `sku` if present, `brand` only if real.
- `offers`: `@type: Offer`, `price`, `priceCurrency: "AUD"`, `availability` (`InStock` / `SoldOut`), `itemCondition: "https://schema.org/UsedCondition"` (these are antiques; never mark them New), `url`, `seller` referencing `#business`.
- No fake `aggregateRating` or reviews.

**Artist pages — `Person`:** `name`, `jobTitle: "Tattoo Artist"`, `worksFor: { "@id": "…#business" }`, `image`, `knowsAbout` (styles).

**FAQ page — `FAQPage`** marking up the visible questions only.

**All non-home pages — `BreadcrumbList`** matching visible breadcrumbs (e.g. Home › Antiques › Product).

## B6. Images

- Every `<img>`/`next/image` has meaningful `alt`. Rules:
  - Products: product name (plus era/material if in the name). Gallery extras: `{name}, view {n}`.
  - Tattoo portfolio: `{style} tattoo by {artist} at 666 Tattoo Lawnton` when style is known; otherwise `Tattoo by {artist} at 666 Tattoo Lawnton`. Add a `style` field to artist gallery items in the mock data so this can be filled in (defaults to empty).
  - Decorative images: `alt=""`.
  - Never use filenames as alt text. The scraper must discard alt values that look like filenames (e.g. matching `/^(screenshot|img_|dsc|\d{6,})/i` or containing `.png`/`.jpg`).
- Explicit `width`/`height` (or `fill` with a sized container) on all images to prevent layout shift.
- LCP image (home hero, product main image) uses `priority`.
- Per-page Open Graph images, 1200×630: home uses a shop/storefront photo; products use the main product image; artists use their profile or best piece. Generate a branded fallback with `next/og` (`opengraph-image.tsx`).

## B7. Technical requirements

- **Rendering:** all indexable content is server-rendered (SSG/ISR). No content that only appears after client-side fetching.
- **Canonical:** absolute, self-referencing, built from `NEXT_PUBLIC_SITE_URL`. Always `https://www.666shoplawnton.com` (www, no trailing slash) in production.
- **Robots:** `app/robots.ts` returns `Disallow: /` and all pages emit `noindex, nofollow` when `NEXT_PUBLIC_NOINDEX=true` (every preview). Production allows all except `/cart` and `/api`.
- **Sitemap:** `app/sitemap.ts` lists static pages, all visible products, and all artists, with `lastModified`. Disabled while `NEXT_PUBLIC_NOINDEX=true`.
- **Cart:** `/cart` is `noindex`.
- **404:** custom `not-found.tsx` with links to shop, tattoos and contact. Return real 404 status codes.
- **Sold antiques:** antiques are one-off, so sold items are common. Keep sold product pages live with a clear "Sold" badge, `availability: SoldOut`, and a "similar items" grid. Don't 404 them (they keep ranking and collecting links). After 12 months sold, 301 to the category page. In Phase 1 mock, support a `sold` state in the UI.
- **Performance targets (mobile, field data at launch):** LCP < 2.5s, INP < 200ms, CLS < 0.1. Lighthouse ≥ 90 for Performance, Accessibility, Best Practices and SEO.
- **Fonts:** `next/font` with `display: swap`, subset, max two families.
- **Internal linking:**
  - Home links to `/tattoos`, `/portfolio`, shop, and contact with descriptive anchor text (not "click here").
  - `/tattoos` links to each artist and the FAQ and aftercare pages.
  - Each artist page links to `/tattoos` and contact/booking.
  - Product pages link back to the category and to 4–8 related products.
  - Footer includes NAP, hours, and links to all main pages.
- **Contact:** phone as `tel:+61448677666`, email as `mailto:`. Remove `format-detection: telephone=no` behaviour; phone numbers should be tappable.
- **Map:** lazy-loaded Google Maps embed (or a static map image linking to Google Maps) so it doesn't hurt LCP.
- **Analytics:** Vercel Analytics or GA4 in production only. Google Search Console verification via `metadata.verification` from env var.

## B8. Content to write (for the demo)

Draft these in the demo so the client sees the SEO value, clearly marked `TODO(client)` for facts to confirm:

1. **Home:** three sections (Tattoos, Antiques, Coffee), each with 80–150 words and a link to its page, plus a "Find us" block with the catchment suburbs.
2. **`/tattoos`:** styles offered (traditional, Japanese, realism, cover-ups; confirm the others artists do), the booking process, deposits, pricing guidance, licence number, 30+ years' combined experience, catchment suburbs.
3. **`/tattoo-aftercare`:** step-by-step guide (confirm with the artists' actual advice before launch).
4. **`/faq`:** 8–12 questions. Include age requirement (18+ in Queensland), deposits, pricing, walk-ins, cover-ups, touch-ups, what to bring, parking.
5. **`/gift-vouchers`:** how to buy (in store / phone until online vouchers exist).
6. **Artist bios:** 100–200 words each, including styles, experience, and a booking CTA. Current bios are one or two sentences.

## B9. Pre-launch SEO checklist

- [ ] All `TODO(client)` values replaced (hours, geo, licence, socials, copy facts)
- [ ] Keyword list validated in Semrush (AU) and titles adjusted where a better-volume variant exists
- [ ] Redirect map complete and tested (every old URL from the Wix sitemap returns 200 or 301, never 404)
- [ ] `NEXT_PUBLIC_NOINDEX=false` in production only
- [ ] Sitemap submitted in Google Search Console; old Wix sitemap URLs all resolve
- [ ] Rich Results Test passes for LocalBusiness, Product, FAQPage, BreadcrumbList
- [ ] Lighthouse ≥ 90 on Home, a product page, and an artist page (mobile)
- [ ] Google Business Profile website link, hours and phone match the site exactly
- [ ] Semrush Position Tracking project set up for the High-priority keywords, with a baseline taken before DNS switch
