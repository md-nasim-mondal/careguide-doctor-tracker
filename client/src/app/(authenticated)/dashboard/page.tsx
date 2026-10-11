import { fetchServerApi } from "@/lib/serverApi";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import Link from "next/link";

export const instant = false;

export default async function DashboardPage() {
  let analytics = {
    totalDoctors: 0,
    totalPatients: 0,
    patientsPerDoctor: [],
    registrationsOverTime: []
  };
  let error = "";

  try {
    const res = await fetchServerApi("/dashboard");
    analytics = res.data || analytics;
  } catch (err: unknown) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = "An unknown error occurred loading the dashboard.";
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-foreground bg-background min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <div className="space-x-4">
          <Link href="/doctors" className="text-primary hover:underline font-medium">Manage Doctors</Link>
          <Link href="/patients" className="text-primary hover:underline font-medium">Manage Patients</Link>
          <form action="/api/auth/logout" method="POST" className="inline">
            <button type="submit" className="text-destructive hover:underline font-medium">Logout</button>
          </form>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded shadow-sm border border-destructive/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary text-primary-foreground p-6 rounded shadow-md flex flex-col justify-center items-center">
          <h2 className="text-lg font-medium opacity-90">Total Doctors</h2>
          <p className="text-5xl font-bold mt-2">{analytics.totalDoctors}</p>
        </div>
        <div className="bg-success text-success-foreground p-6 rounded shadow-md flex flex-col justify-center items-center">
          <h2 className="text-lg font-medium opacity-90">Total Patients</h2>
          <p className="text-5xl font-bold mt-2">{analytics.totalPatients}</p>
        </div>
      </div>

      <DashboardCharts 
        patientsPerDoctor={analytics.patientsPerDoctor} 
        registrationsOverTime={analytics.registrationsOverTime} 
      />
    </div>
  );
}
