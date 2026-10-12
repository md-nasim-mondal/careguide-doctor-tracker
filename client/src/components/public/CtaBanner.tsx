import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-12 sm:py-16 bg-linear-to-r from-sky-700 via-primary to-indigo-700 dark:from-slate-900 dark:via-sky-950 dark:to-slate-900 border-y border-border text-white transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
        <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
          Ready to streamline your clinic management?
        </h3>
        <p className="text-white/85 text-sm sm:text-base max-w-xl mx-auto">
          Log in to the DocPulse portal to oversee doctors, patients, and operational metrics.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-md hover:bg-slate-100 transition text-sm cursor-pointer"
          >
            Access Portal
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold rounded-xl transition text-sm cursor-pointer shadow-xs"
          >
            Contact Clinic Support
          </Link>
        </div>
      </div>
    </section>
  );
}
