import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WixImage } from "@/components/WixImage";
import { getArtists, getSiteContent } from "@/lib/data";
import { pageMetadata, wixOgImage } from "@/lib/seo";
import { artistPath } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Tattoo Artists in North Brisbane | 666 Tattoo Lawnton",
  description:
    "Meet the tattoo artists at 666 Tattoo in Lawnton and browse their work across traditional, Japanese, realism and cover-up styles.",
  path: "/portfolio",
  image: {
    url: wixOgImage("https://static.wixstatic.com/media/bfd742_6e4f4b1434c9431483dc39d9d14c8c06~mv2.jpg"),
    width: 1200,
    height: 630,
    alt: "Jimmy, tattoo artist at 666 Tattoo Lawnton",
  },
});

export default async function PortfolioPage() {
  const [intro, artists] = await Promise.all([getSiteContent("portfolio-intro"), getArtists()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <Breadcrumbs items={[{ name: "Our tattoo artists", href: "/portfolio" }]} />
      <h1 className="mt-6 font-display text-5xl md:text-6xl">{intro?.title ?? "Our Tattoo Artists"}</h1>
      {intro?.body && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone/85">{intro.body}</p>}

      <ul className="mt-14 grid gap-10 sm:grid-cols-2">
        {artists.map((a, i) => (
          <li key={a._id}>
            <article className="flex h-full flex-col bg-ink-2">
              <Link href={artistPath(a.slug)} className="group relative block aspect-[4/5] overflow-hidden bg-ink-3">
                <WixImage
                  image={a.profileImage}
                  alt={`${a.title}, tattoo artist at 666 Tattoo Lawnton`}
                  sizes="(min-width: 640px) 540px, 100vw"
                  priority={i < 2}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-3xl">
                  <Link href={artistPath(a.slug)} className="hover:underline">
                    {a.title}
                  </Link>
                </h2>
                {a.specialties.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${a.title}'s specialties`}>
                    {a.specialties.map((s) => (
                      <li key={s} className="border border-brass/40 px-2 py-1 text-xs text-brass">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 flex-1 leading-relaxed text-bone/80">{a.bio.split(/\n{2,}/)[0]}</p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-wider">
                  <Link href={artistPath(a.slug)} className="text-brass hover:underline">
                    View {a.title}&apos;s {a.gallery.length} {a.gallery.length === 1 ? "tattoo" : "tattoos"} →
                  </Link>
                  <Link href={a.bookingUrl || `/contact-us?artist=${a.slug}`} className="text-bone hover:underline">
                    Enquire with {a.title}
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-14 text-bone/80">
        Not sure which artist suits your idea? Read about{" "}
        <Link href="/tattoos" className="text-brass underline">
          the tattoo styles we offer
        </Link>{" "}
        or check our{" "}
        <Link href="/faq" className="text-brass underline">
          tattoo FAQs
        </Link>
        .
      </p>
    </div>
  );
}
