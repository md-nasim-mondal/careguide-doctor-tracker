import Link from "next/link";
import { deletePatientAction } from "@/actions/patients";
import Pagination from "@/components/common/Pagination";
import type { PatientItem, PatientsTableProps } from "@/types";

export type { PatientItem };

export default function PatientsTable({
  patients,
  currentPage,
  totalPages,
  buildQuery,
}: PatientsTableProps) {
  return (
    <div className="bg-card border border-border rounded overflow-hidden shadow-sm flex flex-col justify-between">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-137.5 text-left text-sm text-foreground">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-3 sm:p-4 border-b border-border">Name</th>
              <th className="p-3 sm:p-4 border-b border-border">Age</th>
              <th className="p-3 sm:p-4 border-b border-border">Condition</th>
              <th className="p-3 sm:p-4 border-b border-border">Doctor</th>
              <th className="p-3 sm:p-4 border-b border-border">Date</th>
              <th className="p-3 sm:p-4 border-b border-border">Actions</th>
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
                    <td className="p-3 sm:p-4 font-medium">{p.name}</td>
                    <td className="p-3 sm:p-4">{p.age}</td>
                    <td className="p-3 sm:p-4">{p.condition}</td>
                    <td className="p-3 sm:p-4">{doctorName}</td>
                    <td className="p-3 sm:p-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 sm:p-4 space-x-3">
                      <Link
                        href={`/dashboard/patients${buildQuery({ action: "edit", patientId: p._id })}`}
                        className="text-primary hover:underline font-semibold"
                      >
                        Edit
                      </Link>
                      <form action={deletePatientAction.bind(null, p._id)} className="inline">
                        <button
                          type="submit"
                          className="text-destructive hover:underline font-semibold cursor-pointer"
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
      </div>

      {/* Reusable URL-driven Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildPageUrl={(page: number) => `/dashboard/patients${buildQuery({ page })}`}
      />
    </div>
  );
}
