import Link from "next/link";
import Pagination from "@/components/common/Pagination";
import DataTable, { type ColumnDef } from "@/components/common/DataTable";
import { DOCTOR_TABLE_HEADERS } from "@/constants";
import type { DoctorItem, DoctorsTableProps } from "@/types";

export type { DoctorItem };

export default function DoctorsTable({
  doctors,
  currentPage,
  totalPages,
  buildQuery,
}: DoctorsTableProps) {
  const columns: ColumnDef<DoctorItem>[] = [
    {
      key: "name",
      header: DOCTOR_TABLE_HEADERS.NAME,
      className: "font-medium",
      render: (doc) => doc.name,
    },
    {
      key: "specialization",
      header: DOCTOR_TABLE_HEADERS.SPECIALIZATION,
      render: (doc) => doc.specialization,
    },
    {
      key: "hospital",
      header: DOCTOR_TABLE_HEADERS.HOSPITAL,
      render: (doc) => doc.hospital,
    },
    {
      key: "actions",
      header: DOCTOR_TABLE_HEADERS.ACTIONS,
      render: (doc) => (
        <Link
          href={`/dashboard/doctors${buildQuery({ doctorId: doc._id, action: undefined })}`}
          className="text-primary hover:underline font-semibold"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={doctors}
      keyExtractor={(doc) => doc._id}
      emptyMessage="No doctors found."
      className="lg:col-span-2"
      minWidthClass="min-w-120"
      pagination={
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          buildPageUrl={(p: number) => `/dashboard/doctors${buildQuery({ page: p })}`}
        />
      }
    />
  );
}
