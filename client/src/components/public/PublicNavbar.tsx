import Link from "next/link";
import BrandLogo from "@/components/common/BrandLogo";
import NavLinks, { NavLinkItem } from "./NavLinks";
import MobileMenu from "./MobileMenu";

const NAV_LINKS: NavLinkItem[] = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function PublicNavbar() {
  return (
    <header className="border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <BrandLogo href="/" size="sm" />

          {/* Desktop Navigation Links */}
          <NavLinks links={NAV_LINKS} />
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/login"
            className="px-4 py-2 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition shadow-xs flex items-center gap-1.5"
          >
            <span>Sign In to Portal</span>
            <span className="text-xs opacity-70">→</span>
          </Link>
        </div>

        {/* Mobile Actions: Direct Sign In + Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-1.5">
          <Link
            href="/login"
            className="px-2.5 py-1 text-xs font-semibold text-primary border border-primary/20 rounded-md hover:bg-primary/10 transition"
          >
            Sign In
          </Link>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}

export { PublicNavbar };
