"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLinkItem {
  name: string;
  href: string;
}

interface NavLinksProps {
  links: NavLinkItem[];
  isMobile?: boolean;
  onItemClick?: () => void;
}

export default function NavLinks({ links, isMobile = false, onItemClick }: NavLinksProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-1.5 text-sm font-medium">
        {links.map((link) => {
          const active = isLinkActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onItemClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition ${
                active
                  ? "bg-primary/15 text-primary font-bold border-l-4 border-primary pl-3"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span className="flex items-center gap-2">
                {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                {link.name}
              </span>
              {active && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
      {links.map((link) => {
        const active = isLinkActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 group flex items-center gap-1.5 ${
              active
                ? "text-primary font-semibold bg-primary/10 shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            {active && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
            <span>{link.name}</span>
            {active && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-linear-to-r from-primary to-sky-400 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
