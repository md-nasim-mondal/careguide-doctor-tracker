import Link from "next/link";
import type { Metadata } from "next";
import ContactInfoCards from "@/components/public/ContactInfoCards";
import ContactForm from "@/components/public/ContactForm";
import type { ContactPageSearchParams } from "@/types";

export const metadata: Metadata = {
  title: "Contact Support - CareGuide Doctor Tracker",
  description: "Get in touch with the CareGuide Doctor Tracker technical and clinical administrative support team.",
};

export const instant = false;

type PageProps = {
  searchParams: Promise<ContactPageSearchParams>;
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
        <ContactInfoCards />
        <ContactForm errorMessage={errorMessage} isSent={isSent} />
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

