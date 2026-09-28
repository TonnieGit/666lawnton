import Link from "next/link";
import { getSiteContent } from "@/lib/data";
import { NAV } from "@/lib/site";
import { WixImage } from "@/components/WixImage";
import { CartButton } from "@/components/cart/CartButton";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

// Floating tiles over the page: logo left, nav pill centre, cart/menu right.
const tile = "pointer-events-auto rounded-2xl border border-bone/10";
const glass = "bg-ink-2/80 backdrop-blur-md";

export async function Header() {
  const logo = await getSiteContent("site-logo");
  return (
    // pointer-events-none on the bar so the gaps between tiles don't block clicks underneath.
    <header className="pointer-events-none sticky top-0 z-40 px-3 pt-3 md:px-4 md:pt-4">
      <a
        href="#main"
        className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-xl focus:bg-bone focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link
          href="/"
          className={`${tile} ${glass} flex items-center gap-3 py-1.5 pl-1.5 pr-4`}
          aria-label="666 Tattoo & Antiques, home"
        >
          <span className="relative size-10 overflow-hidden rounded-full md:size-11">
            <WixImage image={logo?.image} alt="" sizes="44px" loading="eager" className="object-cover" />
          </span>
          <span className="font-display text-lg leading-tight">
            666 Tattoo
            <span className="block text-[11px] font-sans uppercase tracking-[0.2em] text-muted">&amp; Antiques</span>
          </span>
        </Link>

        <nav aria-label="Main" className={`${tile} ${glass} hidden p-1.5 lg:block`}>
          <ul className="flex items-center text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="block rounded-xl px-3.5 py-2 hover:bg-bone/10 aria-[current=page]:bg-bone/10 xl:px-4"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* No backdrop-filter here: it would become the containing block for the mobile menu panel. */}
        <div className={`${tile} flex items-center gap-1 bg-ink-2/95 p-1.5`}>
          <CartButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
