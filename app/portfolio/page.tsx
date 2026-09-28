import Link from "next/link";
import { ArtistFeature } from "@/components/ArtistCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getArtists, getSiteContent } from "@/lib/data";
import { pageMetadata, wixOgImage } from "@/lib/seo";

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

      <ul className="mt-14 space-y-6">
        {artists.map((a, i) => (
          <li key={a._id} className={i > 0 ? "reveal" : undefined}>
            <ArtistFeature artist={a} priority={i === 0} />
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
