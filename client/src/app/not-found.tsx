import Link from "next/link";
import BrandLogo from "@/components/common/BrandLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 md:p-10 antialiased selection:bg-primary/20">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <BrandLogo size="md" href="/dashboard" />
        <Link
          href="/dashboard"
          className="text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition flex items-center gap-1.5"
        >
          <span>Dashboard</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </header>

      {/* Main 404 Hero Section */}
      <main className="w-full max-w-2xl mx-auto my-auto py-12 px-4 text-center space-y-8 animate-fade-in">
        {/* Visual Badge with Medical Pulse & 404 */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl pointer-events-none" />
          <div className="relative flex flex-col items-center">
            <span className="text-7xl sm:text-9xl font-black tracking-tight text-primary/20 select-none">
              404
            </span>
            <div className="-mt-10 sm:-mt-14 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-md text-xs sm:text-sm font-bold text-foreground">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Route or Resource Not Found</span>
            </div>
          </div>
        </div>

        {/* Heading & Context */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            We couldn&apos;t find that page
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            The medical record, dashboard directory, or requested endpoint does not exist, has been removed, or is temporarily restricted.
          </p>
        </div>

        {/* Quick Links / Pathways */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition shadow-sm text-xs sm:text-sm cursor-pointer flex items-center gap-2"
          >
            <span>📊</span>
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/dashboard/patients"
            className="px-5 py-2.5 bg-card hover:bg-muted text-foreground border border-border font-medium rounded-xl transition text-xs sm:text-sm shadow-2xs flex items-center gap-2"
          >
            <span>👥</span>
            <span>Patients Directory</span>
          </Link>
          <Link
            href="/dashboard/doctors"
            className="px-5 py-2.5 bg-card hover:bg-muted text-foreground border border-border font-medium rounded-xl transition text-xs sm:text-sm shadow-2xs flex items-center gap-2"
          >
            <span>👨‍⚕️</span>
            <span>Doctors Directory</span>
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 bg-card hover:bg-muted text-muted-foreground border border-border font-medium rounded-xl transition text-xs sm:text-sm shadow-2xs"
          >
            Home Portal
          </Link>
        </div>

        {/* Helpful Info Box */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border/80 text-xs text-muted-foreground max-w-md mx-auto text-left space-y-1">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <span>🔍</span> Looking for something specific?
          </p>
          <p>
            Check the URL spelling or verify your assigned clinical permissions if you were directed to an internal doctor or patient file.
          </p>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="w-full max-w-6xl mx-auto text-center py-4 border-t border-border/60 text-2xs sm:text-xs text-muted-foreground">
        DocPulse Healthcare Management System &bull; Secure Electronic Health Tracker
      </footer>
    </div>
  );
}
