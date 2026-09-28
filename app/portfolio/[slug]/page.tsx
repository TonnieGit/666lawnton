import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtistGallery } from "@/components/ArtistGallery";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink, Paragraphs } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { WixImage } from "@/components/WixImage";
import { getArtists } from "@/lib/data";
import type { ArtistItem } from "@/lib/data/types";
import { wixImageToUrl } from "@/lib/media";
import { pageMetadata, wixOgImage } from "@/lib/seo";
import { artistPath } from "@/lib/site";
import { personJsonLd } from "@/lib/structured-data";

// Old Wix URLs /portfolio-collections/my-portfolio/{slug} 301 here (next.config.ts).
type Props = { params: Promise<{ slug: string }> };

async function getArtist(slug: string) {
  return (await getArtists()).find((a) => a.slug === slug) ?? null;
}

/** Experience + top styles + booking CTA, 140–160 chars (seo.md §B4). */
function artistDescription(a: ArtistItem) {
  const first = a.bio.split(/(?<=\.)\s/)[0] ?? "";
  const styles = a.specialties.slice(0, 3).join(", ").toLowerCase();
  const base = styles && !first.toLowerCase().includes(styles.split(",")[0]) ? `${first} Styles: ${styles}.` : first;
  const short = " Book at 666 Tattoo, Lawnton.";
  const long = " Browse their tattoo portfolio and book at 666 Tattoo in Lawnton, North Brisbane.";
  const cta = base.length + long.length <= 160 ? long : short;
  const text = `${base}${cta}`;
  return text.length > 160 ? `${base.slice(0, 160 - cta.length - 1).trimEnd()}…${cta}` : text;
}

export async function generateStaticParams() {
  return (await getArtists()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await getArtist((await params).slug);
  if (!artist) return {};
  const img = wixImageToUrl(artist.profileImage);
  return pageMetadata({
    title: `${artist.title}, Tattoo Artist in Lawnton | 666 Tattoo`,
    description: artistDescription(artist),
    path: artistPath(artist.slug),
    image: img ? { url: wixOgImage(img.src), width: 1200, height: 630, alt: `${artist.title}, tattoo artist` } : null,
  });
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
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <JsonLd data={personJsonLd(artist)} />
      <Breadcrumbs
        items={[
          { name: "Our tattoo artists", href: "/portfolio" },
          { name: artist.title, href: artistPath(artist.slug) },
        ]}
      />

      <div className="mt-6 grid gap-10 md:grid-cols-[320px_1fr] md:items-start">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-3">
          <WixImage
            image={artist.profileImage}
            alt={`${artist.title}, tattoo artist at 666 Tattoo Lawnton`}
            sizes="(min-width: 768px) 320px, 100vw"
            priority
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brass">Tattoo artist · Lawnton</p>
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
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-bone/85">
            <Paragraphs text={artist.bio} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={artist.bookingUrl || `/contact-us?artist=${artist.slug}`}>
              Book with {artist.title}
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
          <p className="mt-6 text-sm text-muted">
            Learn more about{" "}
            <Link href="/tattoos" className="text-brass underline">
              our tattoo styles and booking process
            </Link>
            .
          </p>
        </div>
      </div>

      {artist.gallery.length > 0 && (
        <section aria-labelledby="work" className="mt-16">
          <h2 id="work" className="font-display text-3xl">
            Tattoos by {artist.title}
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
