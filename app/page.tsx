import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { BusinessDetails, MapEmbed } from "@/components/LocationBlock";
import { ProductGrid } from "@/components/product/ProductCard";
import { WixImage } from "@/components/WixImage";
import { getArtists, getBusinessInfo, getProducts, getSiteContent } from "@/lib/data";
import { localBusinessJsonLd } from "@/lib/structured-data";
import { artistPath } from "@/lib/site";

export default async function Home() {
  const [hero, tattoo, antiques, coffee, artistsIntro, { items: latest }, artists, business] = await Promise.all([
    getSiteContent("home-hero"),
    getSiteContent("home-tattoo"),
    getSiteContent("home-antiques"),
    getSiteContent("home-coffee"),
    getSiteContent("home-artists"),
    getProducts({ sort: "newest", limit: 8 }),
    getArtists(),
    getBusinessInfo(),
  ]);

  return (
    <>
      <JsonLd data={localBusinessJsonLd(business)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-bone/10">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brass">Lawnton · North Brisbane</p>
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
            <div className="relative aspect-[763/636] w-full overflow-hidden">
              <WixImage
                image={hero.image}
                alt="Colour hummingbird tattoo on a forearm, with the 666 Tattoo Lawnton logo"
                sizes="(min-width: 768px) 480px, 100vw"
                priority
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Three sides of the business */}
      <section aria-labelledby="what-we-do" className="mx-auto max-w-6xl px-4 py-20">
        <h2 id="what-we-do" className="sr-only">
          What we do
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {[tattoo, antiques, coffee].filter(Boolean).map((item, i) => (
            <li key={item!._id} className="flex flex-col bg-ink-2">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-3">
                {item!.image ? (
                  <WixImage
                    image={item!.image}
                    alt=""
                    sizes="(min-width: 768px) 360px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center">
                    <span aria-hidden="true" className="font-display text-7xl text-brass/80">
                      ☕
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-display text-sm text-brass">0{i + 1}</p>
                <h3 className="mt-1 font-display text-3xl">{item!.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-bone/80">{item!.body}</p>
                {item!.ctaHref && (
                  <Link href={item!.ctaHref} className="mt-5 text-sm font-semibold uppercase tracking-wider text-brass hover:underline">
                    {item!.ctaLabel} →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Latest antiques (on paper, so product photos read cleanly) */}
      <section aria-labelledby="latest" className="bg-paper py-20 text-ink">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-dark">Fresh on the shelves</p>
              <h2 id="latest" className="mt-2 font-display text-4xl">
                Our antiques
              </h2>
            </div>
            <Link href="/category/all-products" className="text-sm font-semibold uppercase tracking-wider text-blood hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-10 [&_.text-muted]:text-muted-dark [&_.text-blood-bright]:text-blood">
            <ProductGrid products={latest} />
          </div>
        </div>
      </section>

      {/* Artists teaser */}
      {artists.length > 0 && (
        <section aria-labelledby="artists" className="mx-auto max-w-6xl px-4 py-20">
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
                  <div className="relative aspect-[3/4] overflow-hidden bg-ink-3">
                    <WixImage
                      image={a.profileImage}
                      alt={`${a.title}, tattoo artist`}
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

      {/* Location */}
      <section aria-labelledby="visit" className="border-t border-bone/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brass">Visit</p>
            <h2 id="visit" className="mt-2 font-display text-4xl">
              Come say hi
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-bone/80">
              Drop in for a coffee, have a dig through the antiques, or chat to the team about your next tattoo.
            </p>
            <div className="mt-8">
              <BusinessDetails business={business} />
            </div>
          </div>
          <MapEmbed business={business} className="min-h-80" />
        </div>
      </section>
    </>
  );
}
