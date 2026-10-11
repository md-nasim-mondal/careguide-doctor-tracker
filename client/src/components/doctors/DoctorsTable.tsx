import Link from "next/link";
import Pagination from "@/components/common/Pagination";

export interface DoctorItem {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

interface DoctorsTableProps {
  doctors: DoctorItem[];
  currentPage: number;
  totalPages: number;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export default function DoctorsTable({
  doctors,
  currentPage,
  totalPages,
  buildQuery,
}: DoctorsTableProps) {
  return (
    <div className="lg:col-span-2 bg-card border border-border rounded overflow-hidden shadow-sm flex flex-col justify-between">
      <table className="w-full text-left text-sm text-foreground">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-4 border-b border-border">Name</th>
            <th className="p-4 border-b border-border">Specialization</th>
            <th className="p-4 border-b border-border">Hospital</th>
            <th className="p-4 border-b border-border">Actions</th>
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
                <td className="p-4">{doc.name}</td>
                <td className="p-4">{doc.specialization}</td>
                <td className="p-4">{doc.hospital}</td>
                <td className="p-4">
                  <Link
                    href={`/dashboard/doctors${buildQuery({ doctorId: doc._id, action: undefined })}`}
                    className="text-primary hover:underline font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Reusable URL-driven Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildPageUrl={(p: number) => `/dashboard/doctors${buildQuery({ page: p })}`}
      />
    </div>
  );
}
