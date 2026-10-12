import Link from "next/link";
import { HeroStatItem } from "./HeroStatItem";

const HERO_STATS = [
  { value: "100%", label: "Assignment Integrity" },
  { value: "Real-Time", label: "Workload Analytics" },
  { value: "Zero", label: "Orphaned Patients" },
  { value: "JWT & RBAC", label: "Enterprise Security" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-b from-primary/5 via-background to-background">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            <span>🏥</span>
            <span>Next-Gen Healthcare Management</span>
          </div>

          <h1 className="text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Intelligent Doctor &amp; Patient Tracking for Modern Clinics
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Coordinate care delivery with precision. Manage doctor specializations, dynamic patient assignments, and clinical workload analytics in one secure workspace.
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:opacity-90 transition text-center text-xs sm:text-sm"
            >
              Sign In to Portal
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-6 py-2.5 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition text-center text-xs sm:text-sm"
            >
              Learn More
            </Link>
          </div>

          {/* Quick Stat Highlights */}
          <div className="pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 border-t border-border/60">
            {HERO_STATS.map((stat) => (
              <HeroStatItem key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
