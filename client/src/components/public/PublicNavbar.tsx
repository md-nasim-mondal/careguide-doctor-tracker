"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/common/BrandLogo";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    setCurrentHash(window.location.hash);
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" && (!currentHash || currentHash === "#");
    }
    if (href.startsWith("/#")) {
      const targetHash = href.substring(1);
      return pathname === "/" && currentHash === targetHash;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <BrandLogo href="/" size="sm" />

          {/* Desktop Navigation with Active Indicators */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    if (link.href.includes("#")) {
                      setCurrentHash(link.href.split("#")[1] ? `#${link.href.split("#")[1]}` : "");
                    } else {
                      setCurrentHash("");
                    }
                  }}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 group flex items-center gap-1.5 ${
                    active
                      ? "text-primary font-semibold bg-primary/10 shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {/* Subtle active pulse dot */}
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                  <span>{link.name}</span>

                  {/* Active bottom accent bar */}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-linear-to-r from-primary to-sky-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/login"
            className="px-4 py-2 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition shadow-xs flex items-center gap-1.5"
          >
            <span>Sign In to Portal</span>
            <span className="text-xs opacity-70">→</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-1.5">
          <Link
            href="/login"
            className="px-2.5 py-1 text-xs font-semibold text-primary border border-primary/20 rounded-md hover:bg-primary/10 transition"
          >
            Sign In
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            className="p-1.5 rounded-md border border-border text-foreground hover:bg-muted text-base"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3 shadow-lg animate-fade-in">
          <nav className="flex flex-col space-y-1.5 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setIsOpen(false);
                    if (link.href.includes("#")) {
                      setCurrentHash(link.href.split("#")[1] ? `#${link.href.split("#")[1]}` : "");
                    } else {
                      setCurrentHash("");
                    }
                  }}
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

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary/90 transition shadow-xs"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export { PublicNavbar };


