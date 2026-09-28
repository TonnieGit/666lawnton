import type { Metadata } from "next";
import Link from "next/link";
import { WixImage } from "@/components/WixImage";
import { getArtists, getSiteContent } from "@/lib/data";
import { artistPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our tattoo artists",
  description: "See the artwork from our tattoo artists here at 666 Tattoo and Antiques Shop in Lawnton, North Brisbane.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const [intro, artists] = await Promise.all([getSiteContent("portfolio-intro"), getArtists()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-brass">The studio</p>
      <h1 className="mt-2 font-display text-5xl md:text-6xl">{intro?.title ?? "Our artists"}</h1>
      {intro?.body && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone/85">{intro.body}</p>}

      <ul className="mt-14 grid gap-10 sm:grid-cols-2">
        {artists.map((a, i) => (
          <li key={a._id}>
            <article className="flex h-full flex-col bg-ink-2">
              <Link href={artistPath(a.slug)} className="group relative block aspect-[4/5] overflow-hidden bg-ink-3">
                <WixImage
                  image={a.profileImage}
                  alt={`${a.title}, tattoo artist at 666 Tattoo`}
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
                <p className="mt-4 flex-1 leading-relaxed text-bone/80">{a.bio}</p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-wider">
                  <Link href={artistPath(a.slug)} className="text-brass hover:underline">
                    View {a.gallery.length} {a.gallery.length === 1 ? "piece" : "pieces"} →
                  </Link>
                  <Link
                    href={a.bookingUrl || `/contact-us?artist=${a.slug}`}
                    className="text-bone hover:underline"
                  >
                    Enquire with {a.title}
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
