import Link from "next/link";
import Pagination from "@/components/common/Pagination";
import type { DoctorItem, DoctorsTableProps } from "@/types";

export type { DoctorItem };

export default function DoctorsTable({
  doctors,
  currentPage,
  totalPages,
  buildQuery,
}: DoctorsTableProps) {
  return (
    <div className="lg:col-span-2 bg-card border border-border rounded overflow-hidden shadow-sm flex flex-col justify-between">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-120 text-left text-sm text-foreground">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-3 sm:p-4 border-b border-border">Name</th>
              <th className="p-3 sm:p-4 border-b border-border">Specialization</th>
              <th className="p-3 sm:p-4 border-b border-border">Hospital</th>
              <th className="p-3 sm:p-4 border-b border-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No doctors found.
                </td>
              </tr>
            ) : (
              doctors.map((doc) => (
                <tr key={doc._id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="p-3 sm:p-4 font-medium">{doc.name}</td>
                  <td className="p-3 sm:p-4">{doc.specialization}</td>
                  <td className="p-3 sm:p-4">{doc.hospital}</td>
                  <td className="p-3 sm:p-4">
                    <Link
                      href={`/dashboard/doctors${buildQuery({ doctorId: doc._id, action: undefined })}`}
                      className="text-primary hover:underline font-semibold"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reusable URL-driven Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildPageUrl={(p: number) => `/dashboard/doctors${buildQuery({ page: p })}`}
      />
    </div>
  );
}
