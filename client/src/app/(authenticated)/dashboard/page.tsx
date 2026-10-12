import { fetchServerApi } from "@/lib/serverApi";
import { getCurrentUser } from "@/lib/auth";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import AlertBanner from "@/components/common/AlertBanner";
import Link from "next/link";
import type { DashboardAnalytics, DoctorListResponse, PatientListResponse } from "@/types";

export const instant = false;

interface DashboardPageProps {
  searchParams?: Promise<{
    unauthorized?: string;
    error?: string;
    success?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const unauthorizedCode = resolvedParams.unauthorized;
  const errorParam = resolvedParams.error;
  const successParam = resolvedParams.success;

  let securityNotice = "";
  if (unauthorizedCode === "patient_restricted") {
    securityNotice = "Access Restricted: As a Patient, you have access to your personal medical records and the verified doctor directory. Clinic-wide patient records are restricted to attending physicians and clinic administrators.";
  } else if (unauthorizedCode === "admin_required") {
    securityNotice = "Access Denied: Administrative privileges (Admin / Super Admin) are required to access user account management.";
  } else if (unauthorizedCode === "doctor_required") {
    securityNotice = "Access Denied: Doctor clinical portal credentials are required to view that area.";
  } else if (unauthorizedCode === "patient_portal_only") {
    securityNotice = "Access Restricted: That area is reserved for patient portal access.";
  } else if (unauthorizedCode) {
    securityNotice = "Access Denied: You do not have permission to view the requested page.";
  }

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
      const res = await fetchServerApi<DashboardAnalytics>("/dashboard/analytics");
      analytics = res.data || analytics;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = "An unknown error occurred loading the dashboard analytics.";
      }
    }
  }

  // 1. Role: PATIENT (Patient / Portal User)
  if (role === "PATIENT") {
    let patientRecord = null;
    let availableDoctors: Array<{ _id: string; name: string; specialization: string; hospital: string; phone: string; email: string }> = [];
    let patientFetchError = "";

    try {
      const [patientRes, doctorsRes] = await Promise.all([
        fetchServerApi<PatientListResponse>(`/patients?search=${encodeURIComponent(user?.name || "")}&limit=5`),
        fetchServerApi<DoctorListResponse>(`/doctors?limit=10`),
      ]);
      patientRecord = patientRes.data?.patients?.find((p: { name: string }) => 
        p.name.toLowerCase().trim() === (user?.name || "").toLowerCase().trim()
      ) || patientRes.data?.patients?.[0] || null;
      availableDoctors = doctorsRes.data?.doctors || [];
    } catch (err: unknown) {
      patientFetchError = err instanceof Error ? err.message : "Unable to reach healthcare server.";
    }

    const assignedDoctor = typeof patientRecord?.doctor === "object" ? patientRecord.doctor : null;

    return (
      <div className="w-full space-y-6">
        {/* Security & Access Notice */}
        {securityNotice && <AlertBanner message={securityNotice} variant="error" />}
        {errorParam && <AlertBanner message={errorParam} variant="error" />}
        {successParam && <AlertBanner message={successParam} variant="success" />}

        {/* Server Connection Error Alert */}
        {patientFetchError && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1 wrap-break-word">{patientFetchError}</span>
          </div>
        )}

        {/* Welcome Header */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🩺</span>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                Patient Health Portal
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Welcome back, <strong className="text-foreground">{user?.name}</strong>. Here is your medical record & attending doctor overview.
            </p>
          </div>
          <Link
            href="/dashboard/doctors"
            className="w-full sm:w-auto text-center px-4 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary/90 transition shadow-xs"
          >
            Find Specialist Doctors
          </Link>
        </div>

        {/* Assigned Doctor & Medical Condition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Assigned Doctor Card */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Your Attending Doctor</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50">
                  {assignedDoctor ? "Assigned" : "Available"}
                </span>
              </div>
              {assignedDoctor ? (
                <div className="space-y-2 mt-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                    <span>👨‍⚕️</span> {assignedDoctor.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong className="text-foreground">Specialty:</strong> {assignedDoctor.specialization}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong className="text-foreground">Hospital Chamber:</strong> {assignedDoctor.hospital}
                  </p>
                  {assignedDoctor.phone && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <strong className="text-foreground">Contact:</strong> {assignedDoctor.phone}
                    </p>
                  )}
                  {assignedDoctor.email && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <strong className="text-foreground">Email:</strong> {assignedDoctor.email}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-2 text-xs sm:text-sm text-muted-foreground space-y-2">
                  <p>You have not been assigned a primary physician yet.</p>
                  <p>Browse our directory of verified specialists to consult with a doctor.</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex justify-end">
              <Link
                href="/dashboard/doctors"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Browse All Doctors →
              </Link>
            </div>
          </div>

          {/* Current Health Status / Condition Card */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Medical Status &amp; Notes</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-semibold border border-blue-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/50">
                  Active Patient
                </span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Reported Condition:</span>
                  <span className="font-bold text-foreground">
                    {patientRecord?.condition || "Regular Health Checkup"}
                  </span>
                </div>
                {patientRecord?.age && (
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Registered Age:</span>
                    <span className="font-bold text-foreground">{patientRecord.age} Years</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Network Hospital:</span>
                  <span className="font-bold text-foreground">DocPulse Healthcare</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Registration Status:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Verified &amp; Active</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl text-xs font-semibold flex items-center gap-2">
                <span>🚨</span>
                <span>24/7 Emergency Line: 10666 / +880 9610-000000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Specialist Doctors */}
        {availableDoctors.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Available Doctors in Network
              </h2>
              <Link href="/dashboard/doctors" className="text-xs text-primary hover:underline font-semibold">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableDoctors.slice(0, 3).map((doc) => (
                <div key={doc._id} className="p-3.5 rounded-xl border border-border bg-muted/40 hover:bg-muted/70 transition">
                  <h4 className="font-bold text-xs sm:text-sm text-foreground">{doc.name}</h4>
                  <p className="text-xs text-primary font-medium">{doc.specialization}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">🏥 {doc.hospital}</p>
                  {doc.phone && <p className="text-[11px] text-muted-foreground">📞 {doc.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Role: DOCTOR (Doctor / Care Specialist)
  if (role === "DOCTOR") {
    let doctorProfile: { _id: string; name: string; email: string; phone: string; specialization: string; hospital: string } | null = null;
    let assignedPatients: Array<{ _id: string; name: string; age?: number; condition?: string; createdAt?: string }> = [];
    let doctorFetchError = "";

    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        fetchServerApi<DoctorListResponse>(`/doctors?search=${encodeURIComponent(user?.email || user?.name || "")}&limit=10`),
        fetchServerApi<PatientListResponse>(`/patients?limit=100`),
      ]);

      const doctorsList = doctorsRes.data?.doctors || [];
      doctorProfile = doctorsList.find((d: { email: string }) => d.email.toLowerCase() === (user?.email || "").toLowerCase()) 
        || doctorsList.find((d: { name: string }) => d.name.toLowerCase().includes((user?.name || "").toLowerCase()))
        || doctorsList[0] 
        || null;

      const allPatients = patientsRes.data?.patients || [];
      if (doctorProfile) {
        assignedPatients = allPatients.filter((p: { doctor?: { _id?: string } | string }) => {
          const docId = typeof p.doctor === "object" ? p.doctor?._id : p.doctor;
          return docId === doctorProfile?._id;
        });
      } else {
        assignedPatients = allPatients.slice(0, 5);
      }
    } catch (err: unknown) {
      doctorFetchError = err instanceof Error ? err.message : "Unable to reach healthcare server.";
    }

    return (
      <div className="w-full space-y-6">
        {/* Security & Access Notice */}
        {securityNotice && <AlertBanner message={securityNotice} variant="error" />}
        {errorParam && <AlertBanner message={errorParam} variant="error" />}
        {successParam && <AlertBanner message={successParam} variant="success" />}

        {/* Server Connection Error Alert */}
        {doctorFetchError && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1 wrap-break-word">{doctorFetchError}</span>
          </div>
        )}

        {/* Doctor Header */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👨‍⚕️</span>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                Doctor Practice Dashboard
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Logged in as <strong className="text-foreground">{user?.name}</strong> • {doctorProfile?.specialization || "Clinical Specialist"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link
              href="/dashboard/patients?action=add"
              className="flex-1 sm:flex-none text-center px-4 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary/90 transition shadow-xs"
            >
              + Add New Patient
            </Link>
            <Link
              href="/dashboard/patients"
              className="flex-1 sm:flex-none text-center px-4 py-2 bg-muted text-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-muted/80 transition border border-border"
            >
              All Patients
            </Link>
          </div>
        </div>

        {/* Doctor Profile & Key Practice Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-card border border-border p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Assigned Patients</span>
              <span className="text-base">👥</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-primary mt-2">
              {assignedPatients.length}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Active under your medical care</p>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Primary Chamber</span>
              <span className="text-base">🏥</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-foreground mt-2 truncate">
              {doctorProfile?.hospital || "DocPulse Medical Center"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{doctorProfile?.specialization || "General Medicine"}</p>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Practice Status</span>
              <span className="text-base">🟢</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              Active Specialist
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Licensed & verified</p>
          </div>
        </div>

        {/* Assigned Patients Roster */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Your Assigned Patient Roster ({assignedPatients.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Directly assigned patients requiring your regular review and follow-up.
              </p>
            </div>
            <Link
              href="/dashboard/patients"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Manage in Patient Directory →
            </Link>
          </div>

          {assignedPatients.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border rounded-xl">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                No patients are currently assigned directly to your roster.
              </p>
              <Link
                href="/dashboard/patients?action=add"
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90"
              >
                + Register Patient to Yourself
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-[11px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Patient Name</th>
                    <th className="py-2.5 px-3">Age</th>
                    <th className="py-2.5 px-3">Medical Condition</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assignedPatients.map((p) => (
                    <tr key={p._id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 font-semibold text-foreground">{p.name}</td>
                      <td className="py-3 px-3 text-muted-foreground">{p.age || "—"}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
                          {p.condition || "General"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/dashboard/patients?action=edit&patientId=${p._id}`}
                          className="px-2.5 py-1 text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border rounded"
                        >
                          Update Notes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Default: ADMIN / SUPER_ADMIN
  return (
    <div className="w-full space-y-6">
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
            Real-time doctor admissions, patient tracking, user role management, and capacity analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Link
            href="/dashboard/users"
            className="flex-1 sm:flex-none text-center px-3.5 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary/90 transition shadow-xs"
          >
            🛡️ Manage Users
          </Link>
          <Link
            href="/dashboard/doctors"
            className="flex-1 sm:flex-none text-center px-3.5 py-2 bg-card border border-border text-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-muted transition"
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

      {/* Security & Access Notice */}
      {securityNotice && <AlertBanner message={securityNotice} variant="error" />}
      {errorParam && <AlertBanner message={errorParam} variant="error" />}
      {successParam && <AlertBanner message={successParam} variant="success" />}

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span className="flex-1 wrap-break-word">{error}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <div className="bg-card border border-border text-foreground p-4 sm:p-6 rounded-2xl shadow-xs flex items-center justify-between gap-3 relative overflow-hidden group hover:border-primary/40 transition">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Registered Doctors</p>
            <p className="text-2xl sm:text-4xl font-extrabold mt-1 tracking-tight text-foreground">
              {analytics.totalDoctors}
            </p>
            <Link
              href="/dashboard/doctors"
              className="text-xs font-semibold text-primary hover:underline mt-2 inline-flex items-center gap-1 truncate max-w-full"
            >
              View all doctors directory →
            </Link>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-2xl sm:text-3xl shrink-0">
            🩺
          </div>
        </div>

        <div className="bg-card border border-border text-foreground p-4 sm:p-6 rounded-2xl shadow-xs flex items-center justify-between gap-3 relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Registered Patients</p>
            <p className="text-2xl sm:text-4xl font-extrabold mt-1 tracking-tight text-foreground">
              {analytics.totalPatients}
            </p>
            <Link
              href="/dashboard/patients"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-2 inline-flex items-center gap-1 truncate max-w-full"
            >
              View patient registry →
            </Link>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl sm:text-3xl shrink-0">
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
