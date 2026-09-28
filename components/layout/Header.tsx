import Link from "next/link";
import { getSiteContent } from "@/lib/data";
import { NAV } from "@/lib/site";
import { WixImage } from "@/components/WixImage";
import { CartButton } from "@/components/cart/CartButton";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

export async function Header() {
  const logo = await getSiteContent("site-logo");
  return (
    <header className="sticky top-0 z-40 border-b border-bone/10 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-bone focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-20">
        <Link href="/" className="flex items-center gap-3" aria-label="666 Tattoo & Antiques, home">
          <span className="relative size-11 overflow-hidden rounded-full md:size-14">
            <WixImage image={logo?.image} alt="" sizes="56px" priority className="object-cover" />
          </span>
          <span className="font-display text-lg leading-tight md:text-xl">
            666 Tattoo
            <span className="block text-xs font-sans uppercase tracking-[0.2em] text-muted">&amp; Antiques</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <CartButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
