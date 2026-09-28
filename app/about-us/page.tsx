import type { Metadata } from "next";
import { ButtonLink, Paragraphs } from "@/components/ButtonLink";
import { WixImage } from "@/components/WixImage";
import { getSiteContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Learn more about us at 666 Tattoos North Brisbane and Antiques in Lawnton. With decades of experience and tonnes of goth and cool antiquities.",
  alternates: { canonical: "/about-us" },
};

export default async function AboutPage() {
  const [intro, whatWeDo] = await Promise.all([getSiteContent("about-intro"), getSiteContent("about-what-we-do")]);
  const blocks = [
    { item: intro, alt: "Colour hummingbird tattoo by 666 Tattoo Lawnton" },
    { item: whatWeDo, alt: "666 Tattoo gift certificates and Dr Pickles tattoo aftercare products" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-brass">Learn more about</p>
      <h1 className="mt-2 font-display text-5xl md:text-6xl">666 Tattoo &amp; Antiques</h1>

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
    </div>
  );
}
