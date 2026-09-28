import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ButtonLink";
import { WixImage } from "@/components/WixImage";
import { getArtists, getBusinessInfo } from "@/lib/data";
import { pageMetadata, wixOgImage } from "@/lib/seo";
import { artistPath } from "@/lib/site";

// TODO(client): demo copy drafted from the live site (seo.md §B8.2). Confirm the
// full list of styles each artist offers, the booking process and deposit wording.

const HERO = "wix:image://v1/bfd742_401af3b46787482982b30cc42913175b~mv2.jpg/bfd742_401af3b46787482982b30cc42913175b~mv2.jpg#originWidth=763&originHeight=636";

export const metadata = pageMetadata({
  title: "Custom & Cover-Up Tattoos, North Brisbane | 666 Tattoo",
  description:
    "Traditional, Japanese, realism and cover-up tattoos by experienced artists in Lawnton, close to Strathpine, Petrie and North Lakes. Enquire now.",
  path: "/tattoos",
  image: {
    url: wixOgImage("https://static.wixstatic.com/media/bfd742_401af3b46787482982b30cc42913175b~mv2.jpg"),
    width: 1200,
    height: 630,
    alt: "Colour hummingbird tattoo by 666 Tattoo Lawnton",
  },
});

const STYLES = [
  {
    name: "Traditional",
    body: "Bold lines, a strong palette and timeless designs that read clearly from across the room and hold up for decades.",
    artists: ["jimmy"],
  },
  {
    name: "Japanese",
    body: "Koi, dragons, peonies and waves, designed to flow with the body. Great for larger pieces, sleeves and back work.",
    artists: ["jimmy"],
  },
  {
    name: "Realism & portraits",
    body: "Detailed black and grey or colour realism, including portraits of people and pets, built from good reference photos.",
    artists: ["jimmy", "jeff"],
  },
  {
    name: "Blackwork, stipple & fine line",
    body: "From heavy solid blackwork to soft dotwork shading and delicate single-needle line work.",
    artists: ["jeff", "lindsay"],
  },
  {
    name: "Neo traditional & florals",
    body: "Traditional foundations with more colour, depth and detail. Botanical and floral pieces are a favourite.",
    artists: ["lindsay"],
  },
];

export default async function TattoosPage() {
  const [artists, business] = await Promise.all([getArtists(), getBusinessInfo()]);
  const byslug = new Map(artists.map((a) => [a.slug, a]));
  const nearby = business.catchment.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <Breadcrumbs items={[{ name: "Tattoos", href: "/tattoos" }]} />

      <section className="mt-6 grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="font-display text-5xl leading-[0.95] md:text-6xl">Custom Tattoos in North Brisbane</h1>
          <p className="mt-6 text-lg leading-relaxed text-bone/85">
            666 Tattoo is a custom tattoo studio in Lawnton on Brisbane&apos;s northside. Our artists bring more than 30
            years of combined experience in the Queensland tattoo industry, and every design is drawn for you, from
            small first tattoos to full sleeves and back pieces.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-bone/85">
            We&apos;re on Gympie Road, a short drive from {nearby.slice(0, -1).join(", ")} and {nearby.at(-1)}. Come in to
            talk through your idea, see the artists&apos; work in person and find the right artist for your style.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact-us">Enquire about a tattoo</ButtonLink>
            <ButtonLink href="/portfolio" variant="outline">
              Browse artist portfolios
            </ButtonLink>
          </div>
        </div>
        <div className="relative aspect-[763/636] w-full overflow-hidden">
          <WixImage
            image={HERO}
            alt="Colour hummingbird tattoo by 666 Tattoo Lawnton"
            sizes="(min-width: 768px) 420px, 100vw"
            priority
            className="object-cover"
          />
        </div>
      </section>

      <section aria-labelledby="styles" className="mt-20">
        <h2 id="styles" className="font-display text-4xl">
          Japanese, Traditional &amp; More Tattoo Styles
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-bone/85">
          Each artist has their own strengths, so tell us the style you&apos;re after and we&apos;ll match you with the
          right person.
        </p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STYLES.map((s) => (
            <li key={s.name} className="bg-ink-2 p-6">
              <h3 className="font-display text-2xl">{s.name}</h3>
              <p className="mt-3 leading-relaxed text-bone/80">{s.body}</p>
              <p className="mt-4 text-sm text-muted">
                Ask for{" "}
                {s.artists
                  .map((slug) => byslug.get(slug))
                  .filter(Boolean)
                  .map((a, i, arr) => (
                    <span key={a!.slug}>
                      <Link href={artistPath(a!.slug)} className="text-brass underline">
                        {a!.title}
                      </Link>
                      {i < arr.length - 2 ? ", " : i === arr.length - 2 ? " or " : ""}
                    </span>
                  ))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="cover-ups" aria-labelledby="cover-ups-title" className="mt-20 scroll-mt-24 border-l-4 border-blood bg-ink-2 p-8 md:p-10">
        <h2 id="cover-ups-title" className="font-display text-4xl">
          Cover-Up Tattoos
        </h2>
        <div className="mt-5 max-w-3xl space-y-4 leading-relaxed text-bone/85">
          <p>
            Not every tattoo ages the way you hoped. Lines blur, colours fade, and sometimes the design just isn&apos;t
            you any more. A good cover-up turns an old tattoo into something you&apos;re proud to show off.
          </p>
          <p>
            Cover-ups are one of our specialities. Jimmy has spent more than 20 years reworking and covering tattoos, and
            he&apos;ll plan a design that uses the shapes and dark areas of your existing ink rather than fighting them.
            Some tattoos can be reworked and refreshed instead of fully covered, and he&apos;ll talk you through both
            options.
          </p>
          <p>Send us a clear, well-lit photo of the tattoo you want covered, with its rough size, to get started.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact-us?artist=jimmy">Ask about a cover-up</ButtonLink>
          <ButtonLink href={artistPath("jimmy")} variant="outline">
            See Jimmy&apos;s work
          </ButtonLink>
        </div>
      </section>

      <div className="mt-20 grid gap-14 md:grid-cols-2">
        <section aria-labelledby="booking">
          <h2 id="booking" className="font-display text-3xl">
            How Booking Works
          </h2>
          <ol className="mt-6 space-y-5">
            {[
              ["Send an enquiry", "Tell us your idea, the size, placement and any reference images. Say which artist you'd like, or let us match you."],
              ["Consult and quote", "Your artist will talk through the design and give you a quote. Pop into the studio if you'd like to chat in person."],
              ["Pay a deposit", "A deposit secures your appointment and covers drawing time. It comes off the final price."],
              ["Get tattooed", "Bring photo ID (you must be 18+), eat beforehand and wear comfortable clothes. Then follow our aftercare guide."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blood font-display text-white">{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{t}</h3>
                  <p className="mt-1 text-bone/80">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="pricing">
          <h2 id="pricing" className="font-display text-3xl">
            Tattoo Pricing &amp; Deposits
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-bone/85">
            <p>
              Every tattoo is quoted individually. Price depends on the size, the amount of detail, the placement on your
              body and how many sessions it will take. Larger pieces like sleeves are usually done over several sessions.
            </p>
            <p>
              We&apos;ll always give you a quote before you commit, and a deposit is needed to lock in your booking.
            </p>
            {business.licenceNumber && <p>Licensed tattoo studio, licence {business.licenceNumber}.</p>}
          </div>
          <ul className="mt-6 space-y-2 text-sm">
            <li>
              <Link href="/faq" className="text-brass underline">
                Tattoo FAQs: pricing, deposits, age rules and walk-ins
              </Link>
            </li>
            <li>
              <Link href="/tattoo-aftercare" className="text-brass underline">
                How to look after your new tattoo
              </Link>
            </li>
            <li>
              <Link href="/gift-vouchers" className="text-brass underline">
                Tattoo gift vouchers
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <section aria-labelledby="team" className="mt-20">
        <h2 id="team" className="font-display text-3xl">
          Our Lawnton Tattoo Artists
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {artists.map((a) => (
            <li key={a._id}>
              <Link href={artistPath(a.slug)} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-ink-3">
                  <WixImage
                    image={a.profileImage}
                    alt={`${a.title}, tattoo artist at 666 Tattoo Lawnton`}
                    sizes="(min-width: 768px) 270px, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 font-display text-xl group-hover:underline">{a.title}</h3>
                <p className="text-sm text-muted">{a.specialties.slice(0, 3).join(" · ") || "Tattoo artist"}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
