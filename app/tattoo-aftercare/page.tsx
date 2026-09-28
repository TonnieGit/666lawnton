import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { FlashIcon } from "@/components/FlashIcon";
import { Eyebrow, PageHero, Section } from "@/components/Section";
import { pageMetadata } from "@/lib/seo";

// TODO(client): general aftercare guidance drafted for the demo (seo.md §B8.3).
// Replace with the artists' own advice (wrap time, products, etc.) before launch.

export const metadata = pageMetadata({
  title: "Tattoo Aftercare Guide | 666 Tattoo Lawnton",
  description:
    "How to look after your new tattoo, day by day, from the artists at 666 Tattoo in Lawnton, North Brisbane. Cleaning, moisturising, sun care and healing tips.",
  path: "/tattoo-aftercare",
  type: "article",
});

const STAGES = [
  {
    when: "The first few hours",
    steps: [
      "Leave the wrap or film on for as long as your artist tells you. It protects the fresh tattoo from bacteria and friction.",
      "Wash your hands before you touch your tattoo, every time.",
      "When you remove the wrap, gently wash the tattoo with lukewarm water and a mild, fragrance-free soap to remove plasma and excess ink.",
      "Pat it dry with a clean paper towel. Don't rub, and don't use a shared bath towel.",
    ],
  },
  {
    when: "Days 1 to 3",
    steps: [
      "Wash gently two or three times a day and pat dry.",
      "Apply a very thin layer of tattoo aftercare balm. Less is more: the tattoo should look moist, not shiny or greasy.",
      "Some redness, swelling and weeping is normal in the first couple of days.",
      "Wear loose, clean clothing over the area and sleep on clean sheets.",
    ],
  },
  {
    when: "Days 4 to 14",
    steps: [
      "Your tattoo will start to flake and peel, and it may feel itchy. Don't pick, scratch or peel it; let the flakes fall off on their own.",
      "Keep moisturising lightly whenever the skin feels tight or dry.",
      "Avoid swimming pools, the ocean, spas and baths. Short showers are fine.",
      "Keep it out of direct sun, and don't use fake tan or sunscreen on it until it's healed.",
    ],
  },
  {
    when: "Weeks 2 to 4 and beyond",
    steps: [
      "The surface will look healed, but the skin underneath is still settling. Keep moisturising and keep it out of the sun.",
      "Once fully healed, use a high-SPF sunscreen every time it's exposed. Sun is the biggest cause of fading.",
      "If any area needs a touch-up after healing, get in touch and we'll sort it out.",
    ],
  },
];

export default function AftercarePage() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Tattoos", href: "/tattoos" },
          { name: "Tattoo aftercare", href: "/tattoo-aftercare" },
        ]}
        eyebrow="Aftercare"
        title="Tattoo Aftercare Guide"
      >
        <p>
          Good tattoo aftercare makes a real difference to how your tattoo heals and how it looks for years to come.
          Here&apos;s how the team at 666 Tattoo in Lawnton recommends looking after your new tattoo, stage by stage. Always
          follow any specific instructions your artist gives you on the day.
        </p>
      </PageHero>

      <Section tone="light" aria-label="Aftercare, stage by stage">
        <ol className="grid gap-4 md:grid-cols-2">
          {STAGES.map((s, i) => (
            <li key={s.when} className="reveal rounded-2xl bg-ink-2 p-6 md:p-8">
              <p className="font-display text-5xl text-brass">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 font-display text-3xl">{s.when}</h2>
              <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-bone/85 marker:text-blood-bright">
                {s.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <section aria-labelledby="warning" className="reveal rounded-3xl bg-blood p-6 text-white md:p-8">
            <FlashIcon name="heart" className="size-10" />
            <h2 id="warning" className="mt-4 font-display text-3xl">
              When to get help
            </h2>
            <p className="mt-3 leading-relaxed text-white/90">
              Redness and tenderness that get worse after the first few days, spreading heat or swelling, pus, a bad smell or
              a fever can be signs of infection. See a doctor straight away, then let us know.
            </p>
          </section>

          <section aria-labelledby="products" className="reveal rounded-3xl border border-bone/10 bg-ink-2 p-6 md:p-8">
            <Eyebrow>In store</Eyebrow>
            <h2 id="products" className="mt-2 font-display text-3xl">
              Aftercare products
            </h2>
            <p className="mt-3 leading-relaxed text-bone/85">
              We stock quality tattoo aftercare products at our Lawnton shop, so you can pick up everything you need on the
              day of your appointment. Got questions?{" "}
              <Link href="/faq" className="text-brass underline">
                Read our tattoo FAQs
              </Link>{" "}
              or{" "}
              <Link href="/contact-us" className="text-brass underline">
                get in touch
              </Link>
              .
            </p>
            <div className="mt-6">
              <ButtonLink href="/tattoos" variant="outline">
                Explore our tattoo styles
              </ButtonLink>
            </div>
          </section>
        </div>
      </Section>
    </>
  );
}
