import Link from "next/link";
import type { Metadata } from "next";
import { submitContactInquiryAction } from "@/actions/contact";

export const metadata: Metadata = {
  title: "Contact Support - CareGuide Doctor Tracker",
  description: "Get in touch with the CareGuide Doctor Tracker technical and clinical administrative support team.",
};

export const instant = false;

type PageProps = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

export default async function ContactPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const isSent = resolved.sent === "true";
  const errorMessage = resolved.error || "";
  return (
    <div className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-foreground">
      {/* Intro Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
          Support & Inquiries
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight">Contact Clinical Support</h1>
        <p className="text-muted-foreground leading-relaxed">
          Need assistance with doctor directory setup, patient record migrations, or role permissions? Our team is available 24/7 for clinical partners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
              📍
            </div>
            <h3 className="font-bold text-lg">Hospital Operations HQ</h3>
            <p className="text-sm text-muted-foreground">
              CareGuide Health Informatics Group<br />
              Plot 12, Medical Square, Health City
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
              ✉️
            </div>
            <h3 className="font-bold text-lg">Direct Communications</h3>
            <p className="text-sm text-muted-foreground">
              Clinical Support: <span className="font-mono text-foreground">support@careguide.local</span><br />
              Administration: <span className="font-mono text-foreground">admin@careguide.local</span>
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
              ⏰
            </div>
            <h3 className="font-bold text-lg">Support Coverage</h3>
            <p className="text-sm text-muted-foreground">
              Clinical Emergency: <strong>24/7/365</strong><br />
              Standard IT Desk: <strong>Mon - Fri (8:00 AM - 6:00 PM)</strong>
            </p>
          </div>
        </div>

        {/* Contact / Inquiry Form */}
        <div className="lg:col-span-2 p-8 bg-card border border-border rounded-2xl shadow-sm space-y-6">
          <h2 className="text-2xl font-bold">Send Support Inquiry</h2>
          <p className="text-sm text-muted-foreground">
            Submit a request to our administrative integration engineers. We typically respond within 2 hours.
          </p>

          {errorMessage && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
              ❌ {errorMessage}
            </div>
          )}

          {isSent && (
            <div className="p-4 bg-success/10 border border-success/30 text-success rounded-xl text-sm font-medium">
              ✅ Thank you! Your support inquiry has been successfully submitted to our clinical engineering team.
            </div>
          )}

          <form action={submitContactInquiryAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">Your Name</label>
              <input
                name="name"
                type="text"
                placeholder="Dr. Sarah Johnson"
                className="w-full p-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">Hospital / Clinic</label>
              <input
                name="hospital"
                type="text"
                placeholder="City General Hospital"
                className="w-full p-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="sarah.johnson@hospital.org"
                className="w-full p-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">Department / Issue Type</label>
              <select name="topic" className="w-full p-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring">
                <option>Doctor Record Management</option>
                <option>Patient Reassignment & Transfers</option>
                <option>Analytics & Reporting Inquiries</option>
                <option>Authentication & Account Recovery</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea
                name="message"
                rows={4}
                placeholder="Describe your question or technical request..."
                className="w-full p-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                All communications are protected under HIPAA data privacy protocols.
              </p>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition text-sm shadow-sm"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Helpful links banner */}
      <div className="p-6 bg-muted/40 border border-border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-sm">Need immediate portal access?</h4>
          <p className="text-xs text-muted-foreground">If you are an authorized administrator, proceed directly to the portal.</p>
        </div>
        <Link
          href="/login"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          Go to Admin Login
        </Link>
      </div>
    </div>
  );
}
