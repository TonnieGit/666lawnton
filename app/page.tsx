import Link from "next/link";
import { ButtonLink, Paragraphs } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { BusinessDetails, MapEmbed } from "@/components/LocationBlock";
import { ProductGrid } from "@/components/product/ProductCard";
import { WixImage } from "@/components/WixImage";
import { getArtists, getBusinessInfo, getProducts, getSiteContent } from "@/lib/data";
import { pageMetadata, wixOgImage } from "@/lib/seo";
import { artistPath } from "@/lib/site";
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

export default async function Home() {
  const [hero, tattoo, antiques, artistsIntro, findUs, { items: latest }, artists, business] = await Promise.all([
    getSiteContent("home-hero"),
    getSiteContent("home-tattoo"),
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
      <section className="relative overflow-hidden border-b border-bone/10">
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

      {/* Tattoos (ink), then Antiques (paper, running into the product grid below) (seo.md §B8.1) */}
      {[
        { item: tattoo, alt: "Jimmy, tattoo artist at 666 Tattoo Lawnton, at work", eyebrow: "Tattoos" },
        { item: antiques, alt: "Vintage silver measure from the 666 antiques shop", eyebrow: "Antiques" },
      ].map(({ item, alt, eyebrow }, i) =>
        item ? (
          <section key={item._id} aria-labelledby={item._id} className={i % 2 ? "surface-light" : ""}>
            <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-20 md:grid-cols-2 md:gap-16">
              <div className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-3 ${i % 2 ? "md:order-2" : ""}`}>
                {item.image && (
                  <WixImage image={item.image} alt={alt} sizes="(min-width: 768px) 540px, 100vw" className="object-cover" />
                )}
              </div>
              <div>
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
        ) : null,
      )}

      {/* Latest antiques (on paper, so product photos read cleanly) */}
      <section aria-labelledby="latest" className="surface-light pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
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
          <div className="mt-10">
            <ProductGrid products={latest} headingLevel="h3" />
          </div>
        </div>
      </section>

      {/* Artists teaser */}
      {artists.length > 0 && (
        <section aria-labelledby="artists" className="mx-auto max-w-6xl px-4 py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-brass">The studio</p>
            <h2 id="artists" className="mt-2 font-display text-4xl">
              {artistsIntro?.title}
            </h2>
            <p className="mt-4 leading-relaxed text-bone/80">{artistsIntro?.body}</p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {artists.map((a) => (
              <li key={a._id}>
                <Link href={artistPath(a.slug)} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-3">
                    <WixImage
                      image={a.profileImage}
                      alt={`${a.title}, tattoo artist at 666 Tattoo Lawnton`}
                      sizes="(min-width: 768px) 270px, 50vw"
                      className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>
                  <h3 className="mt-3 font-display text-xl group-hover:underline">{a.title}</h3>
                  <p className="text-sm text-muted">{a.specialties.slice(0, 3).join(" · ") || "Tattoo artist"}</p>
                </Link>
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
          <div>
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
          <MapEmbed business={business} className="min-h-80 rounded-2xl" />
        </div>
      </section>
    </>
  );
}
