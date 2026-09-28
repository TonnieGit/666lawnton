import { ButtonLink } from "@/components/ButtonLink";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-display text-8xl text-brass">404</p>
      <h1 className="mt-4 font-display text-3xl">This one’s already been sold… or never existed.</h1>
      <p className="mt-4 text-bone/80">The page you’re after isn’t here. Try one of these instead.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/category/all-products">Browse antiques</ButtonLink>
        <ButtonLink href="/tattoos" variant="outline">
          Our tattoos
        </ButtonLink>
        <ButtonLink href="/contact-us" variant="outline">
          Contact us
        </ButtonLink>
      </div>
    </div>
  );
}
