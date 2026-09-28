# TODO(client) — facts to confirm before launch

Everything below is placeholder or draft in the demo. Search the code for `TODO(client)` to find each spot.
Source of the requirement: `seo.md` §B5, §B8, §B9.

## Business details (`data/mock/business.json`)
- [ ] **Opening hours** (`hours`) — not published anywhere on the current site. Shown as "Hours to be confirmed" until set; omitted from structured data while empty.
- [ ] **Geo coordinates** (`geo`) — lat/long of 21/666 Gympie Road. Omitted from structured data while null.
- [ ] **Tattoo licence number** (`licenceNumber`) — Facebook shows two (4654751 and 4616385). Confirm which is current.
- [ ] **Storefront photo** (`images`) — for structured data and the home page social share image.
- [ ] **One canonical business name and phone** everywhere (Instagram @666tattoocafe lists 0432 654 957).
- [ ] **Instagram handle(s)** — business and per artist (`artists.json` → `instagram`).

## Copy drafted for the demo (confirm facts, then edit freely)
- [ ] Home — Tattoos and Antiques sections, "Find us" catchment block (`app/page.tsx`)
- [ ] `/tattoos` — styles, booking process, deposits, pricing guidance (`app/tattoos/page.tsx`)
- [ ] `/faq` — all answers, especially deposits, pricing, walk-ins, parking (`lib/content/faq.ts`)
- [ ] `/tattoo-aftercare` — replace with the artists' actual aftercare advice (`app/tattoo-aftercare/page.tsx`)
- [ ] `/gift-vouchers` — how to buy, amounts, expiry (`app/gift-vouchers/page.tsx`)
- [ ] Artist bios expanded to 100–200 words (`data/mock/artists.json` → `bio`). Current live bios are one or two sentences.
- [ ] Product page "Good to know" block — condition, pickup and postage wording (`components/product/ProductNotes.tsx`)

## Product data (don't change silently; flag to the client)
- [ ] Typos in live product names: "Mid **centry** german clear pressed glass salad bowl", "Noritake Gold **Fluer** vintage teapot set"
- [ ] Several descriptions are one-liners — consider adding era, maker, condition and dimensions.

## Portfolio
- [ ] Tattoo **style** for gallery images (`artists.json` → `gallery[].style`) so alt text can read "{style} tattoo by {artist}".

## Other
- [ ] What happens to `jimmytattoo.net` (301 to `/portfolio/jimmy` if they control it)
- [ ] Google Business Profile: website link, hours and phone must match the site exactly
- [ ] Contact form destination (Phase 2)
