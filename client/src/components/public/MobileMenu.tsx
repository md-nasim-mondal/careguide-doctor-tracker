"use client";

import { useState } from "react";
import Link from "next/link";
import NavLinks, { NavLinkItem } from "./NavLinks";
import ThemeToggle from "@/components/common/ThemeToggle";
import { IUserProfile } from "@/types";
import { logoutAction } from "@/actions/auth";

interface MobileMenuProps {
  links: NavLinkItem[];
  user?: IUserProfile | null;
}

export default function MobileMenu({ links, user }: MobileMenuProps) {
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
          {/* If user logged in, show quick profile header in mobile menu */}
          {user && (
            <div className="p-3 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-sky-500 to-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition shrink-0"
              >
                Dashboard →
              </Link>
            </div>
          )}

          <NavLinks links={links} isMobile={true} onItemClick={() => setIsOpen(false)} />

          {/* Theme Switcher Row in Mobile Menu */}
          <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-xl border border-border/70">
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <span>🎨</span>
              <span>Theme</span>
            </span>
            <ThemeToggle align="right" showLabel={true} />
          </div>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {user ? (
              <form action={logoutAction} className="w-full">
                <button
                  type="submit"
                  className="w-full text-center py-2 text-destructive border border-destructive/20 hover:bg-destructive/10 text-xs sm:text-sm font-semibold rounded-lg transition shadow-2xs cursor-pointer"
                >
                  Sign Out
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary/90 transition shadow-xs"
              >
                Sign In to Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
