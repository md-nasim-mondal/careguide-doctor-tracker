import Link from "next/link";
import { createPatientAction, updatePatientAction } from "@/actions/patients";
import type { DoctorOption, PatientFormModel, PatientFormProps } from "@/types";

export type { DoctorOption, PatientFormModel };

export default function PatientForm({
  patient,
  doctorsList,
  isEditing = false,
  isDoctor = false,
  currentDoctorId = "",
  buildQuery,
}: PatientFormProps) {
  const selectedDoctorId =
    typeof patient?.doctor === "object" && patient.doctor
      ? patient.doctor._id
      : (patient?.doctor as string) || currentDoctorId || "";

  const formAction = isEditing && patient?._id
    ? updatePatientAction.bind(null, patient._id)
    : createPatientAction;

  const currentDoctorName =
    doctorsList.find((d) => d._id === (currentDoctorId || selectedDoctorId))?.name ||
    "Assigned to You";

  return (
    <form
      action={formAction}
      className="bg-card p-4 sm:p-6 border border-border rounded mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-foreground shadow-sm"
    >
      <div className="sm:col-span-2 flex items-center justify-between border-b border-border pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">
            {isEditing
              ? isDoctor
                ? "Update Patient Clinical Record"
                : "Edit Patient Details"
              : isDoctor
              ? "Register Patient Under Your Medical Care"
              : "Add New Patient Record"}
          </h2>
          {isDoctor && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Patients registered by specialists are automatically assigned directly to your roster.
            </p>
          )}
        </div>
      </div>

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
        placeholder="Medical Condition / Symptoms"
        required
      />
      <input
        name="email"
        type="email"
        defaultValue={patient?.email || ""}
        className="p-2.5 border border-input rounded bg-background text-xs sm:text-sm"
        placeholder="Email (optional, auto-generated if blank)"
      />
      <input
        name="phone"
        type="tel"
        defaultValue={patient?.phone || ""}
        className="p-2.5 border border-input rounded bg-background text-xs sm:text-sm"
        placeholder="Phone Number (optional)"
      />

      {/* Doctor Assignment Selection or Locked Doctor Display */}
      {isDoctor ? (
        <div className="p-2.5 border border-primary/20 rounded-lg bg-primary/5 flex flex-col justify-center">
          <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wide">
            Attending Specialist (Locked)
          </span>
          <span className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5 mt-0.5">
            👨‍⚕️ {currentDoctorName}
          </span>
          <input type="hidden" name="doctor" value={currentDoctorId || selectedDoctorId} />
        </div>
      ) : (
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
      )}

      <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
        <Link
          href={`/dashboard/patients${buildQuery({ action: undefined, patientId: undefined })}`}
          className="px-4 py-2 border border-border rounded hover:bg-muted text-xs sm:text-sm font-medium flex items-center"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="px-6 py-2 bg-success text-success-foreground rounded hover:opacity-90 font-medium text-xs sm:text-sm cursor-pointer shadow-xs"
        >
          {isEditing
            ? isDoctor
              ? "Update Clinical Notes"
              : "Update Patient"
            : "Save Patient"}
        </button>
      </div>
    </form>
  );
}
