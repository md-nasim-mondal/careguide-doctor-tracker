import Link from "next/link";
import {
  updateDoctorAction,
  deleteDoctorAction,
  removePatientFromDoctorAction,
  addPatientToDoctorAction,
} from "@/actions/doctors";
import type { DoctorDetailsPanelProps } from "@/types";

export default function DoctorDetailsPanel({
  selectedDoctor,
  assignedPatients,
  isEditing,
  isAddingPatient,
  canManage = false,
  isPatient = false,
  buildQuery,
}: DoctorDetailsPanelProps) {
  if (!selectedDoctor) {
    return (
      <div className="bg-card/50 border border-border/80 rounded-xl p-8 text-center text-muted-foreground sticky top-20 shadow-xs">
        <p className="text-2xl mb-2">👨‍⚕️</p>
        <p className="font-medium text-sm">Select a doctor to view details.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 sticky top-20 text-foreground shadow-sm space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-border pb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl shrink-0">👨‍⚕️</span>
            <h3 className="text-base sm:text-lg font-bold text-foreground wrap-break-word leading-tight">
              {selectedDoctor.name}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-7">{selectedDoctor.specialization}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-start sm:self-auto">
          {canManage && (
            <>
              {isEditing ? (
                <Link
                  href={`/dashboard/doctors${buildQuery({ doctorId: selectedDoctor._id, action: undefined })}`}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted text-foreground border border-border hover:bg-muted/80 transition shadow-2xs whitespace-nowrap"
                >
                  Cancel
                </Link>
              ) : (
                <Link
                  href={`/dashboard/doctors${buildQuery({ doctorId: selectedDoctor._id, action: "edit" })}`}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition shadow-2xs whitespace-nowrap"
                >
                  Edit
                </Link>
              )}

              <form action={deleteDoctorAction.bind(null, selectedDoctor._id)} className="inline">
                <button
                  type="submit"
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  Delete
                </button>
              </form>
            </>
          )}

          <Link
            href={`/dashboard/doctors${buildQuery({ doctorId: undefined, action: undefined })}`}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition text-base font-bold ml-0.5 border border-transparent hover:border-border"
            title="Close Panel"
          >
            &times;
          </Link>
        </div>
      </div>

      {/* Doctor Info or Edit Form */}
      {isEditing && canManage ? (
        <form action={updateDoctorAction.bind(null, selectedDoctor._id)} className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
          <input
            name="name"
            defaultValue={selectedDoctor.name}
            className="p-2 border border-input rounded bg-background text-sm"
            placeholder="Full Name"
            required
          />
          <label className="text-xs font-semibold text-muted-foreground">Specialization</label>
          <input
            name="specialization"
            defaultValue={selectedDoctor.specialization}
            className="p-2 border border-input rounded bg-background text-sm"
            placeholder="Specialization"
            required
          />
          <label className="text-xs font-semibold text-muted-foreground">Hospital</label>
          <input
            name="hospital"
            defaultValue={selectedDoctor.hospital}
            className="p-2 border border-input rounded bg-background text-sm"
            placeholder="Hospital"
            required
          />
          <label className="text-xs font-semibold text-muted-foreground">Phone</label>
          <input
            name="phone"
            defaultValue={selectedDoctor.phone}
            className="p-2 border border-input rounded bg-background text-sm"
            placeholder="Phone"
            required
          />
          <label className="text-xs font-semibold text-muted-foreground">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={selectedDoctor.email}
            className="p-2 border border-input rounded bg-background text-sm"
            placeholder="Email"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 mt-2 bg-success text-success-foreground rounded hover:opacity-90 text-sm font-medium cursor-pointer"
          >
            Update Doctor
          </button>
        </form>
      ) : (
        <div className="space-y-2 text-sm bg-muted/30 p-3.5 rounded-lg border border-border/50">
          <div>
            <span className="text-muted-foreground text-xs uppercase font-bold block">Hospital / Chamber</span>
            <span className="font-medium text-foreground wrap-break-word">{selectedDoctor.hospital}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs uppercase font-bold block">Phone</span>
            <span className="font-medium text-foreground break-all">{selectedDoctor.phone}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs uppercase font-bold block">Email</span>
            <span className="font-medium text-foreground break-all">{selectedDoctor.email}</span>
          </div>
        </div>
      )}

      {/* Patient View: Chamber & Consultation Info (Strict Read-Only) */}
      {isPatient ? (
        <div className="border-t border-border pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            🏥 Consultation &amp; Chamber Details
          </h4>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-xs space-y-2.5">
            <div className="flex items-start gap-2 text-foreground">
              <span className="shrink-0">📍</span>
              <div>
                <strong className="block text-foreground">Chamber Location</strong>
                <span className="text-muted-foreground">{selectedDoctor.hospital}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-foreground">
              <span className="shrink-0">📞</span>
              <div>
                <strong className="block text-foreground">Direct Appointment Line</strong>
                <a href={`tel:${selectedDoctor.phone}`} className="text-primary hover:underline font-semibold">
                  {selectedDoctor.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2 text-foreground">
              <span className="shrink-0">✉️</span>
              <div>
                <strong className="block text-foreground">Specialist Inquiries</strong>
                <a href={`mailto:${selectedDoctor.email}`} className="text-primary hover:underline font-semibold">
                  {selectedDoctor.email}
                </a>
              </div>
            </div>
            <div className="pt-2 border-t border-primary/10 text-[11px] text-muted-foreground">
              💡 For appointment booking or specialist consultation, please call the clinic contact number during office hours.
            </div>
          </div>
        </div>
      ) : (
        /* Corresponding Patients Section for Admin & Doctors */
        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold flex items-center gap-1.5">
                <span>👥 Assigned Patients</span>
                <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {assignedPatients.length}
                </span>
              </h4>
            </div>

            {canManage && (
              !isAddingPatient ? (
                <Link
                  href={`/dashboard/doctors${buildQuery({ doctorId: selectedDoctor._id, action: "add-patient" })}`}
                  className="text-xs font-semibold text-primary hover:underline px-2 py-1 rounded border border-primary/20 hover:bg-primary/5 transition"
                >
                  + Add Patient
                </Link>
              ) : (
                <Link
                  href={`/dashboard/doctors${buildQuery({ doctorId: selectedDoctor._id, action: undefined })}`}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Cancel
                </Link>
              )
            )}
          </div>

          {/* Add Patient Under Doctor Form (Only for Admins) */}
          {canManage && isAddingPatient && (
            <form
              action={addPatientToDoctorAction.bind(null, selectedDoctor._id)}
              className="bg-muted/40 p-3.5 rounded-lg border border-border flex flex-col gap-2.5 text-xs"
            >
              <p className="font-semibold text-foreground text-xs">Add New Patient under {selectedDoctor.name}</p>
              <input
                name="name"
                placeholder="Patient Full Name"
                className="p-2 border border-input rounded bg-background text-xs"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  min="0"
                  max="130"
                  className="p-2 border border-input rounded bg-background text-xs"
                  required
                />
                <input
                  name="condition"
                  placeholder="Medical Condition"
                  className="p-2 border border-input rounded bg-background text-xs"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded hover:opacity-90 cursor-pointer text-xs"
              >
                Save Patient
              </button>
            </form>
          )}

          {/* Patients List */}
          {assignedPatients.length === 0 ? (
            <div className="p-4 rounded-lg bg-muted/20 border border-dashed border-border text-center text-xs text-muted-foreground">
              No patients assigned to this doctor yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {assignedPatients.map((pat) => (
                <div
                  key={pat._id}
                  className="p-2.5 rounded-lg bg-card border border-border/80 hover:border-border flex justify-between items-center text-xs transition shadow-2xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-foreground truncate">{pat.name}</p>
                    <p className="text-muted-foreground text-2xs truncate">
                      Age: {pat.age} • {pat.condition}
                    </p>
                  </div>
                  {canManage && (
                    <form
                      action={removePatientFromDoctorAction.bind(null, selectedDoctor._id, pat._id)}
                      className="shrink-0"
                    >
                      <button
                        type="submit"
                        className="text-destructive hover:underline text-2xs font-semibold px-1.5 py-0.5 rounded cursor-pointer hover:bg-destructive/10 transition"
                        title="Remove from doctor"
                      >
                        Delete
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
