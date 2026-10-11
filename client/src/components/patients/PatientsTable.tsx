import Link from "next/link";
import { deletePatientAction } from "@/actions/patients";
import Pagination from "@/components/common/Pagination";
import type { DoctorOption } from "./PatientForm";

export interface PatientItem {
  _id: string;
  name: string;
  age: number;
  condition: string;
  doctor: DoctorOption | string;
  createdAt: string;
}

interface PatientsTableProps {
  patients: PatientItem[];
  currentPage: number;
  totalPages: number;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export default function PatientsTable({
  patients,
  currentPage,
  totalPages,
  buildQuery,
}: PatientsTableProps) {
  return (
    <div className="bg-card border border-border rounded overflow-hidden shadow-sm flex flex-col justify-between">
      <table className="w-full text-left text-sm text-foreground">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-4 border-b border-border">Name</th>
            <th className="p-4 border-b border-border">Age</th>
            <th className="p-4 border-b border-border">Condition</th>
            <th className="p-4 border-b border-border">Doctor</th>
            <th className="p-4 border-b border-border">Date</th>
            <th className="p-4 border-b border-border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                No patients found.
              </td>
            </tr>
          ) : (
            patients.map((p) => {
              const doctorName =
                typeof p.doctor === "object" && p.doctor
                  ? p.doctor.name
                  : "Unassigned";

              return (
                <tr key={p._id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.age}</td>
                  <td className="p-4">{p.condition}</td>
                  <td className="p-4">{doctorName}</td>
                  <td className="p-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 space-x-3">
                    <Link
                      href={`/dashboard/patients${buildQuery({ action: "edit", patientId: p._id })}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Edit
                    </Link>
                    <form action={deletePatientAction.bind(null, p._id)} className="inline">
                      <button
                        type="submit"
                        className="text-destructive hover:underline font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Reusable URL-driven Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildPageUrl={(page: number) => `/dashboard/patients${buildQuery({ page })}`}
      />
    </div>
  );
}
