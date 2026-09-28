import Link from "next/link";
import { ArtistFeature } from "@/components/ArtistCard";
import { PageHero } from "@/components/Section";
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
    <>
      <PageHero
        crumbs={[{ name: "Our tattoo artists", href: "/portfolio" }]}
        eyebrow="The studio"
        title={intro?.title ?? "Our Tattoo Artists"}
      >
        {intro?.body && <p>{intro.body}</p>}
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 pb-20 md:pb-24">
        <ul className="space-y-6">
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
    </>
  );
}
