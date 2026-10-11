import { fetchServerApi } from "@/lib/serverApi";
import { getCurrentUser } from "@/lib/auth";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import Link from "next/link";
import type { DashboardAnalytics } from "@/types";

export const instant = false;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const role = user?.role || "ADMIN";

  let analytics: DashboardAnalytics = {
    totalDoctors: 0,
    totalPatients: 0,
    patientsPerDoctor: [],
    registrationsOverTime: [],
  };
  let error = "";

  // Admins & Super Admins fetch full backend analytics
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    try {
      const res = await fetchServerApi("/dashboard/analytics");
      analytics = res.data || analytics;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = "An unknown error occurred loading the dashboard analytics.";
      }
    }
  }

  // 1. Role: RECEIVER (Patient / Portal User)
  if (role === "RECEIVER") {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👋</span>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                Welcome, {user?.name || "Patient"}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Your personal CareGuide patient portal and medical appointment overview.
            </p>
          </div>
          <Link
            href="/dashboard/doctors"
            className="w-full sm:w-auto text-center px-4 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary/90 transition shadow-xs"
          >
            Find Doctor
          </Link>
        </div>

        {/* Patient Status Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-card border border-border p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Portal Status</span>
              <span className="text-base">🟢</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-foreground mt-2">Active Member</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Verified health account</p>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Hospital Network</span>
              <span className="text-base">🏥</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-foreground mt-2">CareGuide Health</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Multi-specialty network</p>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl shadow-xs col-span-1 xs:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Account Security</span>
              <span className="text-base">🔒</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-foreground mt-2">Protected</p>
            <Link
              href="/dashboard/change-password"
              className="text-[11px] text-primary hover:underline mt-0.5 inline-block font-medium"
            >
              Update Password →
            </Link>
          </div>
        </div>

        {/* Patient Information & Quick Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <span>🩺</span>
              <span>Need Medical Assistance?</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Explore our comprehensive list of qualified specialists across Cardiology,
              Neurology, Pediatrics, Orthopedics and General Medicine.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/dashboard/doctors"
                className="px-3 py-1.5 bg-muted text-foreground text-xs font-medium rounded-lg hover:bg-muted/80 transition"
              >
                Browse Specialist Directory →
              </Link>
              <Link
                href="/contact"
                className="px-3 py-1.5 bg-muted text-foreground text-xs font-medium rounded-lg hover:bg-muted/80 transition"
              >
                Contact Helpdesk →
              </Link>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <span>📞</span>
              <span>Emergency & Support</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              In case of medical emergencies, please reach out directly to the 24/7 hotline or
              visit the nearest CareGuide affiliated medical centre.
            </p>
            <div className="mt-4 p-3 bg-primary/10 text-primary rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <span>🚨</span>
              <span>24/7 Emergency Line: 10666 / +880 9610-000000</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Role: SENDER (Care Staff / Clinic Coordinator)
  if (role === "SENDER") {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Coordinator Header */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏥</span>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                Healthcare Coordinator Hub
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Logged in as {user?.name || "Staff Member"} (Care Coordinator)
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link
              href="/dashboard/patients"
              className="flex-1 sm:flex-none text-center px-4 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary/90 transition shadow-xs"
            >
              + Register Patient
            </Link>
            <Link
              href="/dashboard/doctors"
              className="flex-1 sm:flex-none text-center px-4 py-2 bg-muted text-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-muted/80 transition"
            >
              Doctors Directory
            </Link>
          </div>
        </div>

        {/* Quick Operations Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl shrink-0">
                👥
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">Patient Registry</h3>
                <p className="text-xs text-muted-foreground">Track medical records, condition notes & assigned doctors</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex justify-end">
              <Link href="/dashboard/patients" className="text-xs font-semibold text-primary hover:underline">
                View Patients List →
              </Link>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl shrink-0">
                🩺
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">Doctor Roster</h3>
                <p className="text-xs text-muted-foreground">View doctor specializations, hospital chambers and availability</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex justify-end">
              <Link href="/dashboard/doctors" className="text-xs font-semibold text-primary hover:underline">
                View Doctors List →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Default: ADMIN / SUPER_ADMIN
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h1 className="text-lg sm:text-2xl font-bold text-foreground">
              Administrator Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time doctor admissions, patient tracking, and capacity analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Link
            href="/dashboard/doctors"
            className="flex-1 sm:flex-none text-center px-3.5 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary/90 transition shadow-xs"
          >
            Manage Doctors
          </Link>
          <Link
            href="/dashboard/patients"
            className="flex-1 sm:flex-none text-center px-3.5 py-2 bg-card border border-border text-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-muted transition"
          >
            Manage Patients
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span className="flex-1 wrap-break-word">{error}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <div className="bg-linear-to-br from-primary to-primary/90 text-primary-foreground p-5 sm:p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium opacity-90">Total Registered Doctors</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight">
              {analytics.totalDoctors}
            </p>
            <Link
              href="/dashboard/doctors"
              className="text-[11px] underline opacity-90 hover:opacity-100 mt-2 inline-block"
            >
              View all doctors directory →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0">
            🩺
          </div>
        </div>

        <div className="bg-linear-to-br from-emerald-600 to-emerald-700 text-white p-5 sm:p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium opacity-90">Total Registered Patients</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight">
              {analytics.totalPatients}
            </p>
            <Link
              href="/dashboard/patients"
              className="text-[11px] underline opacity-90 hover:opacity-100 mt-2 inline-block"
            >
              View patient registry →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0">
            👥
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="bg-card border border-border rounded-2xl p-3 sm:p-6 shadow-xs overflow-hidden">
        <DashboardCharts
          patientsPerDoctor={analytics.patientsPerDoctor}
          registrationsOverTime={analytics.registrationsOverTime}
        />
      </div>
    </div>
  );
}
