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
  canManage = true,
  isDoctor = false,
  currentDoctorId = "",
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
      render: (p) => {
        const docId =
          typeof p.doctor === "object" && p.doctor
            ? p.doctor._id
            : (p.doctor as string) || "";
        const isAssignedToThisDoctor = isDoctor && currentDoctorId && docId === currentDoctorId;

        // If Doctor viewing: only allow editing their own assigned patients
        if (isDoctor) {
          if (isAssignedToThisDoctor) {
            return (
              <Link
                href={`/dashboard/patients${buildQuery({ action: "edit", patientId: p._id })}`}
                className="text-primary hover:underline font-semibold"
              >
                Update Notes
              </Link>
            );
          }
          return (
            <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60">
              Assigned to Colleague
            </span>
          );
        }

        // Admin: Full edit and delete permissions
        return (
          <>
            <Link
              href={`/dashboard/patients${buildQuery({ action: "edit", patientId: p._id })}`}
              className="text-primary hover:underline font-semibold"
            >
              Edit
            </Link>
            {canManage && (
              <form action={deletePatientAction.bind(null, p._id)} className="inline">
                <button
                  type="submit"
                  className="text-destructive hover:underline font-semibold cursor-pointer"
                >
                  Delete
                </button>
              </form>
            )}
          </>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={patients}
      keyExtractor={(p) => p._id}
      emptyMessage="No patients found."
      minWidthClass="min-w-[550px]"
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
