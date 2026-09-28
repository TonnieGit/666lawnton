import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtistGallery } from "@/components/ArtistGallery";
import { ButtonLink } from "@/components/ButtonLink";
import { WixImage } from "@/components/WixImage";
import { getArtists } from "@/lib/data";
import { artistPath } from "@/lib/site";
import { wixImageToUrl } from "@/lib/media";

// Keeps the live Wix Portfolio URLs (spec §3 URL parity).
type Props = { params: Promise<{ slug: string }> };

async function getArtist(slug: string) {
  return (await getArtists()).find((a) => a.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return (await getArtists()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await getArtist((await params).slug);
  if (!artist) return {};
  const img = wixImageToUrl(artist.profileImage);
  return {
    title: `${artist.title}, tattoo artist`,
    description: artist.bio,
    alternates: { canonical: artistPath(artist.slug) },
    openGraph: { images: img ? [{ url: img.src, width: img.width, height: img.height }] : undefined },
  };
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;
  const artists = await getArtists();
  const i = artists.findIndex((a) => a.slug === slug);
  if (i < 0) notFound();
  const artist = artists[i];
  const prev = artists[(i - 1 + artists.length) % artists.length];
  const next = artists[(i + 1) % artists.length];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <Link href="/portfolio" className="text-sm text-muted hover:text-bone">
        ← All artists
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[320px_1fr] md:items-start">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-3">
          <WixImage image={artist.profileImage} alt={`${artist.title}, tattoo artist`} sizes="320px" priority className="object-cover" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brass">Tattoo artist</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">{artist.title}</h1>
          {artist.specialties.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Specialties">
              {artist.specialties.map((s) => (
                <li key={s} className="border border-brass/40 px-3 py-1 text-sm text-brass">
                  {s}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone/85">{artist.bio}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={artist.bookingUrl || `/contact-us?artist=${artist.slug}`}>
              Enquire with {artist.title}
            </ButtonLink>
            {artist.instagram && (
              <a
                href={`https://www.instagram.com/${artist.instagram}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-bone/40 px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-bone hover:text-ink"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      {artist.gallery.length > 0 && (
        <section aria-labelledby="work" className="mt-16">
          <h2 id="work" className="font-display text-3xl">
            Work by {artist.title}
          </h2>
          <div className="mt-8">
            <ArtistGallery items={artist.gallery} artist={artist.title} />
          </div>
        </section>
      )}

      {artists.length > 1 && (
        <nav aria-label="Other artists" className="mt-16 flex justify-between border-t border-bone/10 pt-6 text-sm">
          <Link href={artistPath(prev.slug)} className="hover:text-brass">
            ← {prev.title}
          </Link>
          <Link href={artistPath(next.slug)} className="hover:text-brass">
            {next.title} →
          </Link>
        </nav>
      )}
    </div>
  );
}
