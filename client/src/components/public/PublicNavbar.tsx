"use client";

import { useState } from "react";
import Link from "next/link";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link
            href="/"
            className="text-base sm:text-xl font-bold text-primary flex items-center gap-1.5 hover:opacity-90 transition-opacity shrink-0"
          >
            <span className="text-xl">🩺</span>
            <span className="tracking-tight text-foreground">
              <span className="inline">CareGuide</span>
              <span className="hidden xs:inline"> Tracker</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/login"
            className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground hover:text-primary transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition shadow-xs"
          >
            Register
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
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              Home
            </Link>
            <Link
              href="/#features"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              Features
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              About Mission
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              Contact Support
            </Link>
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary/90 transition"
            >
              Create New Account
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2 border border-border text-foreground text-xs sm:text-sm font-medium rounded-lg hover:bg-muted transition"
            >
              Staff &amp; Patient Portal Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export { PublicNavbar };


