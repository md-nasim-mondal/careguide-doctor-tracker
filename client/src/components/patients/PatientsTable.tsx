import Link from "next/link";
import { deletePatientAction } from "@/actions/patients";
import Pagination from "@/components/common/Pagination";
import DataTable, { type ColumnDef } from "@/components/common/DataTable";
import { PATIENT_TABLE_HEADERS } from "@/constants";
import type { PatientItem, PatientsTableProps } from "@/types";

export type { PatientItem };

export default function PatientsTable({
  patients,
  currentPage,
  totalPages,
  buildQuery,
}: PatientsTableProps) {
  const columns: ColumnDef<PatientItem>[] = [
    {
      key: "name",
      header: PATIENT_TABLE_HEADERS.NAME,
      className: "font-medium",
      render: (p) => p.name,
    },
    {
      key: "age",
      header: PATIENT_TABLE_HEADERS.AGE,
      render: (p) => p.age,
    },
    {
      key: "condition",
      header: PATIENT_TABLE_HEADERS.CONDITION,
      render: (p) => p.condition,
    },
    {
      key: "doctor",
      header: PATIENT_TABLE_HEADERS.DOCTOR,
      render: (p) =>
        typeof p.doctor === "object" && p.doctor
          ? p.doctor.name
          : "Unassigned",
    },
    {
      key: "date",
      header: PATIENT_TABLE_HEADERS.DATE,
      render: (p) => new Date(p.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: PATIENT_TABLE_HEADERS.ACTIONS,
      className: "space-x-3",
      render: (p) => (
        <>
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
        </>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={patients}
      keyExtractor={(p) => p._id}
      emptyMessage="No patients found."
      minWidthClass="min-w-137.5"
      pagination={
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          buildPageUrl={(page: number) => `/dashboard/patients${buildQuery({ page })}`}
        />
      }
    />
  );
}
