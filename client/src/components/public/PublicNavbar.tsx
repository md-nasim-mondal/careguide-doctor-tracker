import Link from "next/link";

export function PublicNavbar() {
  return (
    <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span>🩺</span>
            <span className="tracking-tight">CareGuide Tracker</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition shadow-sm"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </header>
  );
}

export default PublicNavbar;
