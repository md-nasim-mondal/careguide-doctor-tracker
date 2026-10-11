import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h3 className="text-3xl font-extrabold tracking-tight">
          Ready to streamline your clinic management?
        </h3>
        <p className="text-primary-foreground/90 text-lg max-w-xl mx-auto">
          Log in to the CareGuide administrative dashboard to oversee doctors, patients, and operational metrics.
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-block px-8 py-3.5 bg-background text-foreground font-bold rounded-lg shadow-lg hover:bg-background/90 transition"
          >
            Sign In to Admin Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
