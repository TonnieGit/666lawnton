import { ButtonLink, Paragraphs } from "@/components/ButtonLink";
import { PageHero, Section } from "@/components/Section";
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

  return (
    <>
      {/* The intro block opens the page (and holds the LCP image), so it isn't revealed on scroll. */}
      <PageHero
        crumbs={[{ name: "About us", href: "/about-us" }]}
        eyebrow="About us"
        title={<>About 666 Tattoo &amp; Antiques</>}
        aside={
          intro?.image && (
            <div className="overflow-hidden rounded-2xl">
              <WixImage
                image={intro.image}
                alt="Colour hummingbird tattoo by 666 Tattoo Lawnton"
                intrinsic
                sizes="(min-width: 768px) 460px, 100vw"
                className="h-auto w-full"
                priority
              />
            </div>
          )
        }
      >
        {intro && (
          <>
            <h2 className="pt-2 font-display text-3xl text-bone">{intro.title}</h2>
            <Paragraphs text={intro.body} />
          </>
        )}
      </PageHero>

      {whatWeDo && (
        <Section tone="light" aria-labelledby={whatWeDo._id}>
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className="reveal md:order-2">
              <h2 id={whatWeDo._id} className="font-display text-4xl md:text-5xl">
                {whatWeDo.title}
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-bone/85">
                <Paragraphs text={whatWeDo.body} />
              </div>
              {whatWeDo.ctaHref && (
                <div className="mt-8">
                  <ButtonLink href={whatWeDo.ctaHref}>{whatWeDo.ctaLabel}</ButtonLink>
                </div>
              )}
            </div>
            {whatWeDo.image && (
              <div className="reveal overflow-hidden rounded-2xl">
                <WixImage
                  image={whatWeDo.image}
                  alt="666 Tattoo gift certificates with tattoo aftercare products"
                  intrinsic
                  sizes="(min-width: 768px) 540px, 100vw"
                  className="h-auto w-full"
                />
              </div>
            )}
          </div>
        </Section>
      )}

      <Section>
        <div className="reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-xl font-display text-3xl leading-tight md:text-4xl">
            Come in for a tattoo, stay for a dig through the shelves.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/tattoos">Our tattoo services</ButtonLink>
            <ButtonLink href="/category/all-products" variant="outline">
              Browse the antiques shop
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
