import type { FeatureItem } from "@/types";
import { FeatureCard } from "./FeatureCard";

const FEATURES: FeatureItem[] = [
  {
    icon: "🩺",
    badgeBg: "bg-primary/10",
    title: "Doctor Management",
    description: "Maintain comprehensive profiles including hospital affiliations, specialization areas, contact details, and current caseload numbers.",
  },
  {
    icon: "📋",
    badgeBg: "bg-success/10",
    title: "Patient Relationship Tracking",
    description: "Intake patients, diagnose conditions, assign attending physicians, and search or filter by date and medical conditions in seconds.",
  },
  {
    icon: "📊",
    badgeBg: "bg-warning/10",
    title: "Analytics & Capacity Charts",
    description: "Interactive bar and trend visualizations show patients per doctor, daily patient registration surges, and overall hospital throughput.",
  },
  {
    icon: "🛡️",
    badgeBg: "bg-destructive/10",
    title: "Deletion Safeguards",
    description: "Built-in relationship verification prevents accidental deletion of doctors who still have active patients assigned to them.",
  },
  {
    icon: "⚡",
    badgeBg: "bg-primary/10",
    title: "URL-Driven Architecture",
    description: "Server Component driven search, filtering, and pagination ensure fast loads, shareable search states, and zero unnecessary client re-renders.",
  },
  {
    icon: "🔐",
    badgeBg: "bg-muted text-foreground",
    title: "Role-Based Access Control",
    description: "Secure HttpOnly cookie token authentication ensures that sensitive clinical registries are accessible only to verified medical staff.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 sm:py-20 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">Features &amp; Capabilities</h2>
          <h3 className="text-xl sm:text-3xl font-bold text-foreground">Everything Healthcare Teams Need</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Built specifically to streamline clinical administrative workflows without complicated setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
