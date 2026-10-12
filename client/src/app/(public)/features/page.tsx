import type { Metadata } from "next";
import Link from "next/link";
import FeaturesSection from "@/components/public/FeaturesSection";
import WorkflowSection from "@/components/public/WorkflowSection";
import CtaBanner from "@/components/public/CtaBanner";

export const metadata: Metadata = {
  title: "Clinical Features & Capabilities - DocPulse",
  description: "Explore the comprehensive features of DocPulse doctor-patient tracker, capacity charts, and clinical safeguards.",
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Features Page Hero */}
      <section className="py-12 sm:py-16 bg-linear-to-b from-primary/5 via-background to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            <span>✨</span>
            <span>Comprehensive Clinical Suite</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Platform Features &amp; Architecture
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover how DocPulse unites doctor directories, dynamic patient management, and real-time clinical workload charts in one intuitive system.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs sm:text-sm hover:opacity-90 transition shadow-xs"
            >
              Get Started Now
            </Link>
            <Link
              href="/about"
              className="px-5 py-2.5 bg-card border border-border text-foreground font-semibold rounded-xl text-xs sm:text-sm hover:bg-muted transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <FeaturesSection />

      {/* Workflow Section */}
      <WorkflowSection />

      {/* Call to action */}
      <CtaBanner />
    </div>
  );
}
