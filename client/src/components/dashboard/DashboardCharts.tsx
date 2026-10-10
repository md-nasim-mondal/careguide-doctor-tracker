"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type PatientPerDoctor = {
  _id: string;
  count: number;
  doctorName: string;
};

type RegistrationData = {
  _id: string; // date string
  count: number;
};

export function DashboardCharts({
  patientsPerDoctor,
  registrationsOverTime,
}: {
  patientsPerDoctor: PatientPerDoctor[];
  registrationsOverTime: RegistrationData[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Patients Per Doctor Chart */}
      <div className="bg-card p-6 border border-border rounded shadow-sm text-card-foreground">
        <h2 className="text-xl font-semibold mb-4 text-center">Patients per Doctor</h2>
        <div className="h-72 w-full">
          {patientsPerDoctor.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientsPerDoctor}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="doctorName" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  cursor={{ fill: "var(--muted)" }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded">
              No patient data assigned to doctors.
            </div>
          )}
        </div>
      </div>

      {/* Registrations Over Time */}
      <div className="bg-card p-6 border border-border rounded shadow-sm text-card-foreground">
        <h2 className="text-xl font-semibold mb-4 text-center">Registrations Over Time</h2>
        <div className="h-72 w-full">
          {registrationsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="_id" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
                <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} name="New Patients" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded">
              No registration history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
