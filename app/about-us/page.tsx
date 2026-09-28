import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink, Paragraphs } from "@/components/ButtonLink";
import { WixImage } from "@/components/WixImage";
import { getSiteContent } from "@/lib/data";
import { pageMetadata, wixOgImage } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About 666 Tattoo & Antiques | Lawnton, North Brisbane",
  description:
    "Learn more about 666 Tattoo & Antiques in Lawnton, North Brisbane: decades of tattoo experience and a shop full of goth, grungy and cool antiquities.",
  path: "/about-us",
  image: {
    url: wixOgImage("https://static.wixstatic.com/media/bfd742_401af3b46787482982b30cc42913175b~mv2.jpg"),
    width: 1200,
    height: 630,
    alt: "Colour hummingbird tattoo by 666 Tattoo Lawnton",
  },
});

export default async function AboutPage() {
  const [intro, whatWeDo] = await Promise.all([getSiteContent("about-intro"), getSiteContent("about-what-we-do")]);
  const blocks = [
    { item: intro, alt: "Colour hummingbird tattoo by 666 Tattoo Lawnton" },
    { item: whatWeDo, alt: "666 Tattoo gift certificates with tattoo aftercare products" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <Breadcrumbs items={[{ name: "About us", href: "/about-us" }]} />
      <h1 className="mt-6 font-display text-5xl md:text-6xl">About 666 Tattoo &amp; Antiques</h1>

      <div className="mt-14 space-y-20">
        {blocks.map(({ item, alt }, i) =>
          item ? (
            <section key={item._id} className="grid items-center gap-10 md:grid-cols-2">
              <div className={i % 2 ? "md:order-2" : ""}>
                <h2 className="font-display text-3xl md:text-4xl">{item.title}</h2>
                <div className="mt-5 space-y-4 text-lg leading-relaxed text-bone/85">
                  <Paragraphs text={item.body} />
                </div>
                {item.ctaHref && (
                  <div className="mt-8">
                    <ButtonLink href={item.ctaHref}>{item.ctaLabel}</ButtonLink>
                  </div>
                )}
              </div>
              {item.image && (
                <div className="relative w-full">
                  <WixImage
                    image={item.image}
                    alt={alt}
                    intrinsic
                    sizes="(min-width: 768px) 540px, 100vw"
                    className="h-auto w-full"
                    priority={i === 0}
                  />
                </div>
              )}
            </section>
          ) : null,
        )}
      </div>

      <div className="mt-20 flex flex-wrap gap-3 border-t border-bone/10 pt-10">
        <ButtonLink href="/tattoos">Our tattoo services</ButtonLink>
        <ButtonLink href="/category/all-products" variant="outline">
          Browse the antiques shop
        </ButtonLink>
      </div>
    </div>
  );
}
