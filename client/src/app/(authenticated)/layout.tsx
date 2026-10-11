import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CareGuide Doctor Tracker - Dashboard",
  description: "Doctor and patient management tracking platform",
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-primary flex items-center gap-2">
              <span>🩺</span>
              <span>Doctor Tracker</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/doctors"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Doctors
              </Link>
              <Link
                href="/dashboard/patients"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Patients
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <form action="/api/auth/logout" method="POST" className="inline">
              <button
                type="submit"
                className="text-sm font-medium text-destructive hover:opacity-80 transition-opacity px-3 py-1.5 rounded border border-destructive/20 hover:bg-destructive/10"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
