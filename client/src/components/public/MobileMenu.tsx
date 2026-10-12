"use client";

import { useState } from "react";
import Link from "next/link";
import NavLinks, { NavLinkItem } from "./NavLinks";

interface MobileMenuProps {
  links: NavLinkItem[];
}

export default function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        className="p-1.5 rounded-md border border-border text-foreground hover:bg-muted text-base shrink-0"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 border-b border-border bg-card px-4 py-4 space-y-3 shadow-lg animate-fade-in md:hidden z-50">
          <NavLinks links={links} isMobile={true} onItemClick={() => setIsOpen(false)} />

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
    </>
  );
}
