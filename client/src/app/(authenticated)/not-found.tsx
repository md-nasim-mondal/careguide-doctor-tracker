import Link from "next/link";

export default function AuthenticatedNotFound() {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-3xl shadow-xs">
        ⚠️
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
          Resource or Section Not Found
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The requested patient record, doctor profile, or dashboard module does not exist or may have been relocated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/dashboard"
          className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition shadow-xs text-xs sm:text-sm"
        >
          Return to Dashboard Overview
        </Link>
        <Link
          href="/dashboard/patients"
          className="px-5 py-2.5 bg-card hover:bg-muted text-foreground border border-border font-medium rounded-xl transition text-xs sm:text-sm"
        >
          View Patients
        </Link>
        <Link
          href="/dashboard/doctors"
          className="px-5 py-2.5 bg-card hover:bg-muted text-foreground border border-border font-medium rounded-xl transition text-xs sm:text-sm"
        >
          View Doctors
        </Link>
      </div>
    </div>
  );
}
