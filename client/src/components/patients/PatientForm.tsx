import Link from "next/link";
import { createPatientAction, updatePatientAction } from "@/actions/patients";
import type { DoctorOption, PatientFormModel, PatientFormProps } from "@/types";

export type { DoctorOption, PatientFormModel };

export default function PatientForm({
  patient,
  doctorsList,
  isEditing = false,
  buildQuery,
}: PatientFormProps) {
  const selectedDoctorId =
    typeof patient?.doctor === "object" && patient.doctor
      ? patient.doctor._id
      : (patient?.doctor as string) || "";

  const formAction = isEditing && patient?._id
    ? updatePatientAction.bind(null, patient._id)
    : createPatientAction;

  return (
    <form
      action={formAction}
      className="bg-card p-4 sm:p-6 border border-border rounded mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-foreground shadow-sm"
    >
      {isEditing && (
        <h2 className="sm:col-span-2 text-lg sm:text-xl font-bold">Edit Patient</h2>
      )}

      <input
        name="name"
        defaultValue={patient?.name || ""}
        className="p-2.5 border border-input rounded bg-background text-xs sm:text-sm"
        placeholder="Full Name"
        required
      />
      <input
        name="age"
        type="number"
        defaultValue={patient?.age !== undefined ? patient.age : ""}
        className="p-2.5 border border-input rounded bg-background text-xs sm:text-sm"
        placeholder="Age"
        required
      />
      <input
        name="condition"
        defaultValue={patient?.condition || ""}
        className="p-2.5 border border-input rounded bg-background text-xs sm:text-sm"
        placeholder="Condition"
        required
      />
      <select
        name="doctor"
        defaultValue={selectedDoctorId}
        className="p-2.5 border border-input rounded bg-background text-xs sm:text-sm"
        required
      >
        <option value="">Select Doctor</option>
        {doctorsList.map((doc) => (
          <option key={doc._id} value={doc._id}>
            {doc.name}
          </option>
        ))}
      </select>

      <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
        <Link
          href={`/dashboard/patients${buildQuery({ action: undefined, patientId: undefined })}`}
          className="px-4 py-2 border border-border rounded hover:bg-muted text-xs sm:text-sm font-medium flex items-center"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="px-6 py-2 bg-success text-success-foreground rounded hover:opacity-90 font-medium text-xs sm:text-sm cursor-pointer"
        >
          {isEditing ? "Update Patient" : "Save Patient"}
        </button>
      </div>
    </form>
  );
}
