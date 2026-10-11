import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - CareGuide Doctor Tracker",
  description: "Learn about the mission, architecture, and clinical standards of the CareGuide Doctor Tracker platform.",
};

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-foreground">
      {/* Intro Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
          Our Mission
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight">Empowering Clinical Teams Through Intelligent Software</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          CareGuide Doctor Tracker was designed to remove administrative friction in outpatient clinics, multi-specialty hospitals, and care networks.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-card border border-border rounded-2xl space-y-4 shadow-sm">
          <div className="text-3xl">🎯</div>
          <h2 className="text-2xl font-bold">The Problem We Solve</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hospitals often struggle with unbalanced physician caseloads, fragmented doctor directories, and orphaned patient records when clinical staff change departments or resign. CareGuide enforces relational integrity so that every patient is actively paired with a licensed attending doctor.
          </p>
        </div>

        <div className="p-8 bg-card border border-border rounded-2xl space-y-4 shadow-sm">
          <div className="text-3xl">💡</div>
          <h2 className="text-2xl font-bold">Our Engineering Standard</h2>
          <p className="text-muted-foreground leading-relaxed">
            Built using modern server-side rendering, strict TypeScript types, and server-driven URL navigation. We prioritize deterministic performance, zero hydration glitches, and immediate feedback for medical administrative teams.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Core Operating Principles</h2>
          <p className="text-muted-foreground mt-2">What guides every feature we build into CareGuide</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-card border border-border rounded-xl space-y-2">
            <h3 className="font-bold text-lg text-primary">Relational Integrity</h3>
            <p className="text-sm text-muted-foreground">Doctors with assigned patients cannot be deleted without reassigning or resolving their patient care list.</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-xl space-y-2">
            <h3 className="font-bold text-lg text-primary">Data Security</h3>
            <p className="text-sm text-muted-foreground">HttpOnly cookie storage, structured JWT tokens, and strict role guards keep medical data private.</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-xl space-y-2">
            <h3 className="font-bold text-lg text-primary">High Accessibility</h3>
            <p className="text-sm text-muted-foreground">Semantic HTML, accessible contrast ratios, and responsive layouts across desktops, tablets, and phones.</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-xl space-y-2">
            <h3 className="font-bold text-lg text-primary">Real-Time Clarity</h3>
            <p className="text-sm text-muted-foreground">Instant aggregated graphs show patient registrations and doctor capacity at a single glance.</p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 bg-primary/5 border border-primary/20 rounded-2xl text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to see the platform in action?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Sign in to the administrative portal to manage your medical staff and patient database.
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition"
          >
            Access Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
