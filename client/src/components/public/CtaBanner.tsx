import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
        <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
          Ready to streamline your clinic management?
        </h3>
        <p className="text-primary-foreground/90 text-sm sm:text-base max-w-xl mx-auto">
          Log in to the CareGuide portal to oversee doctors, patients, and operational metrics.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 bg-background text-foreground font-bold rounded-lg shadow-md hover:bg-background/90 transition text-sm"
          >
            Access Portal
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 py-3 bg-primary-foreground/15 border border-primary-foreground/30 text-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground/25 transition text-sm"
          >
            Contact Clinic Support
          </Link>
        </div>
      </div>
    </section>
  );
}
