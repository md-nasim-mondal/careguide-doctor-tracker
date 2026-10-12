import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-b from-primary/5 via-background to-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            <span>🏥</span>
            <span>Next-Gen Healthcare Management</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Intelligent Doctor &amp; Patient Tracking for Modern Clinics
          </h1>

          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Coordinate care delivery with precision. Manage doctor specializations, dynamic patient assignments, and clinical workload analytics in one secure workspace.
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:opacity-90 transition text-center text-sm"
            >
              Sign In to Portal
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-6 py-3 bg-card border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition text-center text-sm"
            >
              Learn More
            </Link>
          </div>

          {/* Quick Stat Highlights */}
          <div className="pt-8 sm:pt-12 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 border-t border-border/60">
            <div className="p-3 sm:p-4 bg-card/60 border border-border/40 rounded-xl">
              <p className="text-xl sm:text-2xl font-bold text-primary">100%</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Assignment Integrity</p>
            </div>
            <div className="p-3 sm:p-4 bg-card/60 border border-border/40 rounded-xl">
              <p className="text-xl sm:text-2xl font-bold text-primary">Real-Time</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Workload Analytics</p>
            </div>
            <div className="p-3 sm:p-4 bg-card/60 border border-border/40 rounded-xl">
              <p className="text-xl sm:text-2xl font-bold text-primary">Zero</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Orphaned Patients</p>
            </div>
            <div className="p-3 sm:p-4 bg-card/60 border border-border/40 rounded-xl">
              <p className="text-xl sm:text-2xl font-bold text-primary">JWT &amp; RBAC</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Enterprise Security</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
