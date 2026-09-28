import Link from "next/link";
import { WixImage } from "@/components/WixImage";
import type { ArtistItem } from "@/lib/data/types";
import { artistPath } from "@/lib/site";

const tattooCount = (a: ArtistItem) => `${a.gallery.length} ${a.gallery.length === 1 ? "tattoo" : "tattoos"}`;

/**
 * Compact photo tile for the home page: name and portfolio size over the top,
 * experience and styles along the bottom. The shared gradient and greyscale
 * make mismatched profile photos read as one set.
 */
export function ArtistTile({ artist: a }: { artist: ArtistItem }) {
  return (
    <Link
      href={artistPath(a.slug)}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-ink-3 text-white"
    >
      <WixImage
        image={a.profileImage}
        alt={`${a.title}, tattoo artist at 666 Tattoo Lawnton`}
        sizes="(min-width: 768px) 270px, 50vw"
        className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/75 via-black/0 via-45% to-black/90" />
      <div className="absolute inset-x-4 top-4 flex items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl">{a.title}</h3>
        <span className="text-xs text-white/70">/{tattooCount(a)}</span>
      </div>
      <div className="absolute inset-x-4 bottom-4 text-xs">
        {a.experience && <p className="uppercase tracking-[0.2em] text-brass">{a.experience}</p>}
        <p className="mt-1 text-white/80">{a.specialties.slice(0, 3).join(" · ") || "Tattoo artist"}</p>
      </div>
    </Link>
  );
}

/** Full-width case-study card for /portfolio: photo left, story and details right. */
export function ArtistFeature({ artist: a, priority = false }: { artist: ArtistItem; priority?: boolean }) {
  const details = [
    a.specialties.length > 0 && { label: "Styles", value: a.specialties.join(", ") },
    a.experience && { label: "Experience", value: a.experience },
    { label: "Portfolio", value: tattooCount(a) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="grid gap-2 rounded-3xl border border-bone/10 bg-ink-2 p-2 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Link href={artistPath(a.slug)} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-ink-3">
        <WixImage
          image={a.profileImage}
          alt={`${a.title}, tattoo artist at 666 Tattoo Lawnton`}
          sizes="(min-width: 768px) 480px, 100vw"
          priority={priority}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-col p-5 md:p-8">
        <h2 className="font-display text-4xl md:text-5xl">
          <Link href={artistPath(a.slug)} className="hover:underline">
            {a.title}
          </Link>
        </h2>
        <p className="mt-5 flex-1 leading-relaxed text-muted">{a.bio.split(/\n{2,}/)[0]}</p>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
          {details.map((d) => (
            <div key={d.label}>
              <dt className="text-xs text-muted">{d.label}</dt>
              <dd className="mt-0.5 uppercase tracking-wider">{d.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
          <Link href={artistPath(a.slug)} className="text-brass hover:underline">
            View {a.title}&apos;s {tattooCount(a)} →
          </Link>
          <Link href={a.bookingUrl || `/contact-us?artist=${a.slug}`} className="hover:underline">
            Enquire with {a.title}
          </Link>
        </div>
      </div>
    </article>
  );
}
