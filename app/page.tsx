import { Fragment } from "react";
import Link from "next/link";
import { ArtistTile } from "@/components/ArtistCard";
import { ButtonLink, Paragraphs } from "@/components/ButtonLink";
import { FlashIcon, type FlashIconName } from "@/components/FlashIcon";
import { JsonLd } from "@/components/JsonLd";
import { BusinessDetails, MapEmbed } from "@/components/LocationBlock";
import { ProductGrid } from "@/components/product/ProductCard";
import { WixImage } from "@/components/WixImage";
import { getArtists, getBusinessInfo, getProducts, getSiteContent } from "@/lib/data";
import { pageMetadata, wixOgImage } from "@/lib/seo";
import { websiteJsonLd } from "@/lib/structured-data";

// TODO(client): section copy lives in SiteContent (home-*) and was drafted for the
// demo from the live site (seo.md §B8.1). Confirm facts before launch.

export const metadata = pageMetadata({
  title: "Tattoo Studio & Antiques Shop in Lawnton | 666",
  description:
    "Northside Brisbane tattoo studio with 30+ years' combined experience, plus a shop of hand-picked antiques. 21/666 Gympie Rd, Lawnton. Enquire today.",
  path: "/",
  // TODO(client): swap for a storefront photo once supplied (seo.md §B6).
  image: {
    url: wixOgImage("https://static.wixstatic.com/media/bfd742_d25bb5d2f1c742bfa03ce16f754987db~mv2.png"),
    width: 1200,
    height: 630,
    alt: "Vintage silver measure on the shelves at 666 Tattoo & Antiques, Lawnton",
  },
});

// What's under the roof, as a row of tiles (after Lesse's service cards). Photo tiles
// alternate with solid ones. TODO(client): swap in their own photos if preferred.
const TILES: { href: string; title: string; sub: string; icon: FlashIconName; image?: string; alt?: string; tone?: string }[] = [
  {
    href: "/tattoos",
    title: "Tattoos",
    sub: "Custom work and cover-ups",
    icon: "dagger",
    image:
      "wix:image://v1/bfd742_51a5133483734990bf5477f6046e073b~mv2.jpg/bfd742_51a5133483734990bf5477f6046e073b~mv2.jpg#originWidth=1080&originHeight=1080",
    alt: "Colour skull and roses tattoo covering an old tattoo, by Jimmy at 666 Tattoo Lawnton",
  },
  { href: "/tattoo-aftercare", title: "Aftercare", sub: "Look after your new ink", icon: "heart", tone: "bg-ink-3" },
  {
    href: "/category/all-products",
    title: "Antiques",
    sub: "Funky, grungy and different",
    icon: "key",
    image:
      "wix:image://v1/bfd742_fac707ba4025445e885e83eea2993597~mv2.jpg/bfd742_fac707ba4025445e885e83eea2993597~mv2.jpg#originWidth=720&originHeight=1599",
    alt: "1970 Irish Mist soldier whiskey decanter from the 666 antiques shop",
  },
  { href: "/gift-vouchers", title: "Gift vouchers", sub: "Available in any amount", icon: "star", tone: "bg-blood" },
];

export default async function Home() {
  const [hero, statement, tattoo, feature, antiques, artistsIntro, findUs, { items: latest }, artists, business] = await Promise.all([
    getSiteContent("home-hero"),
    getSiteContent("home-statement"),
    getSiteContent("home-tattoo"),
    getSiteContent("home-feature"),
    getSiteContent("home-antiques"),
    getSiteContent("home-artists"),
    getSiteContent("home-find-us"),
    getProducts({ sort: "newest", limit: 8 }),
    getArtists(),
    getBusinessInfo(),
  ]);

  return (
    <>
      <JsonLd data={websiteJsonLd(business)} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* items-start: centring would nudge the image when the web font swaps in (CLS). */}
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brass">666 Tattoo · Lawnton · North Brisbane</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl md:text-7xl">{hero?.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/85">{hero?.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {hero?.ctaHref && <ButtonLink href={hero.ctaHref}>{hero.ctaLabel}</ButtonLink>}
              <ButtonLink href="/category/all-products" variant="outline">
                Shop antiques
              </ButtonLink>
            </div>
          </div>
          {hero?.image && (
            <div className="relative aspect-[763/636] w-full overflow-hidden rounded-2xl">
              <WixImage
                image={hero.image}
                alt="Colour hummingbird tattoo on a forearm, by 666 Tattoo Lawnton"
                sizes="(min-width: 768px) 480px, 100vw"
                priority
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 md:pb-32 md:pt-16">
        {/* Statement: fills in as it scrolls past (globals.css .text-fill) */}
        {statement?.body && (
          <p className="text-fill max-w-4xl font-display text-3xl leading-[1.15] sm:text-4xl md:text-5xl">
            <span>{statement.body}</span>
          </p>
        )}

        <nav aria-label="What's at 666" className="mt-16 md:mt-24">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {TILES.map((t) => (
              <li key={t.href} className="reveal">
                <Link
                  href={t.href}
                  className={`group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl border border-bone/10 p-4 text-white md:p-5 ${t.tone ?? "bg-ink-3"}`}
                >
                  {t.image && (
                    <>
                      <WixImage
                        image={t.image}
                        alt={t.alt ?? ""}
                        sizes="(min-width: 768px) 270px, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/70 via-black/10 to-black/60" />
                    </>
                  )}
                  <span className="relative">
                    <span className="block font-display text-2xl leading-tight md:text-3xl">{t.title}</span>
                    <span className="mt-1 block text-xs text-white/75 md:text-sm">{t.sub}</span>
                  </span>
                  <span className="relative flex items-end justify-between">
                    <FlashIcon name={t.icon} className="size-9 md:size-11" />
                    <span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Tattoos (ink), then Antiques (paper, running into the product grid below) (seo.md §B8.1) */}
      {[
        { item: tattoo, alt: "Jimmy, tattoo artist at 666 Tattoo Lawnton, at work", eyebrow: "Tattoos" },
        { item: antiques, alt: "Vintage silver measure from the 666 antiques shop", eyebrow: "Antiques" },
      ].map(({ item, alt, eyebrow }, i) =>
        item ? (
          <Fragment key={item._id}>
            <section aria-labelledby={item._id} className={i % 2 ? "surface-light" : ""}>
              <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-20 md:grid-cols-2 md:gap-16">
                <div className={`reveal relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-3 ${i % 2 ? "md:order-2" : ""}`}>
                  {item.image && (
                    <WixImage image={item.image} alt={alt} sizes="(min-width: 768px) 540px, 100vw" className="object-cover" />
                  )}
                </div>
                <div className="reveal">
                  <p className="text-xs uppercase tracking-[0.3em] text-brass">{eyebrow}</p>
                  <h2 id={item._id} className="mt-2 font-display text-4xl leading-tight">
                    {item.title}
                  </h2>
                  <div className="mt-6 space-y-4 leading-relaxed text-bone/85">
                    <Paragraphs text={item.body} />
                  </div>
                  {item.ctaHref && (
                    <div className="mt-8">
                      <ButtonLink href={item.ctaHref}>{item.ctaLabel}</ButtonLink>
                    </div>
                  )}
                </div>
              </div>
            </section>
  
            {/* Between tattoos and antiques: a pinned piece that grows as you scroll (globals.css .grow-stage) */}
            {i === 0 && feature?.image && (
              <section aria-labelledby="feature" className="grow-stage">
                <div className="grow-pin flex flex-col items-center justify-center gap-6 overflow-hidden px-4 py-20">
                  <div className="grow-media relative aspect-square w-[min(64dvh,100%)] max-w-3xl overflow-hidden rounded-3xl bg-ink-3">
                    <WixImage
                      image={feature.image}
                      alt="Black and grey tiger tattoo on an upper arm, by Jimmy at 666 Tattoo Lawnton"
                      sizes="(min-width: 768px) 64vh, 92vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="grow-caption flex w-[min(64dvh,100%)] max-w-3xl flex-wrap items-end justify-between gap-x-6 gap-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-brass">{feature.body}</p>
                      <h2 id="feature" className="mt-1 font-display text-2xl md:text-3xl">
                        {feature.title}
                      </h2>
                    </div>
                    {feature.ctaHref && (
                      <Link href={feature.ctaHref} className="text-sm font-semibold text-brass hover:underline">
                        {feature.ctaLabel} →
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            )}
          </Fragment>
        ) : null,
      )}

      {/* Latest antiques (on paper, so product photos read cleanly) */}
      <section aria-labelledby="latest" className="surface-light pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brass">Fresh on the shelves</p>
              <h2 id="latest" className="mt-2 font-display text-4xl">
                Our Antiques Shop
              </h2>
            </div>
            <Link href="/category/all-products" className="text-sm font-semibold text-blood hover:underline">
              View all antiques →
            </Link>
          </div>
          <div className="reveal mt-10">
            <ProductGrid products={latest} headingLevel="h3" />
          </div>
        </div>
      </section>

      {/* Artists teaser */}
      {artists.length > 0 && (
        <section aria-labelledby="artists" className="mx-auto max-w-6xl px-4 py-24">
          <div className="reveal max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-brass">The studio</p>
            <h2 id="artists" className="mt-2 font-display text-4xl">
              {artistsIntro?.title}
            </h2>
            <p className="mt-4 leading-relaxed text-bone/80">{artistsIntro?.body}</p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {artists.map((a) => (
              <li key={a._id} className="reveal">
                <ArtistTile artist={a} />
              </li>
            ))}
          </ul>
          {artistsIntro?.ctaHref && (
            <div className="mt-10">
              <ButtonLink href={artistsIntro.ctaHref} variant="outline">
                {artistsIntro.ctaLabel}
              </ButtonLink>
            </div>
          )}
        </section>
      )}

      {/* Find us */}
      <section aria-labelledby="visit" className="surface-light">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 md:grid-cols-2">
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.3em] text-brass">Find us</p>
            <h2 id="visit" className="mt-2 font-display text-4xl">
              {findUs?.title ?? "Visit our Lawnton studio"}
            </h2>
            {findUs?.body && <p className="mt-4 max-w-md leading-relaxed text-bone/80">{findUs.body}</p>}
            <div className="mt-8">
              <BusinessDetails business={business} />
            </div>
            <p className="mt-8">
              <Link href="/contact-us" className="text-sm font-semibold text-brass hover:underline">
                Contact details and directions →
              </Link>
            </p>
          </div>
          <div className="reveal">
            <MapEmbed business={business} className="min-h-80 rounded-2xl" />
          </div>
        </div>
      </section>
    </>
  );
}
