"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  onClick,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const section = href.split("/")[1];
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href ||
        pathname.startsWith(`/${section}/`) ||
        (section === "portfolio" && pathname.startsWith("/portfolio-collections")) ||
        (section === "category" && pathname.startsWith("/product-page"));
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`transition-colors hover:text-brass aria-[current=page]:text-brass ${className}`}
    >
      {children}
    </Link>
  );
}
