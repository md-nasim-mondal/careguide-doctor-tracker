import Link from "next/link";
import { updateDoctorAction, deleteDoctorAction } from "@/actions/doctors";
import type { DoctorItem } from "./DoctorsTable";

interface DoctorDetailsPanelProps {
  selectedDoctor: DoctorItem | null;
  isEditing: boolean;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export default function DoctorDetailsPanel({
  selectedDoctor,
  isEditing,
  buildQuery,
}: DoctorDetailsPanelProps) {
  if (!selectedDoctor) {
    return (
      <div className="bg-muted border-2 border-dashed border-border rounded p-8 text-center text-muted-foreground sticky top-20">
        Select a doctor to view details.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded p-6 sticky top-20 text-foreground shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{selectedDoctor.name}</h3>
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <Link
              href={`/dashboard/doctors${buildQuery({ doctorId: selectedDoctor._id, action: undefined })}`}
              className="text-primary hover:underline text-sm font-medium"
            >
              Cancel
            </Link>
          ) : (
            <Link
              href={`/dashboard/doctors${buildQuery({ doctorId: selectedDoctor._id, action: "edit" })}`}
              className="text-primary hover:underline text-sm font-medium"
            >
              Edit
            </Link>
          )}

          <form action={deleteDoctorAction.bind(null, selectedDoctor._id)} className="inline">
            <button
              type="submit"
              className="text-destructive hover:underline text-sm font-medium cursor-pointer"
            >
              Delete
            </button>
          </form>

          <Link
            href={`/dashboard/doctors${buildQuery({ doctorId: undefined, action: undefined })}`}
            className="text-muted-foreground hover:text-foreground text-sm font-bold ml-1"
            title="Close"
          >
            &times;
          </Link>
        </div>
      </div>

      {isEditing ? (
        <form action={updateDoctorAction.bind(null, selectedDoctor._id)} className="flex flex-col gap-3">
          <input
            name="name"
            defaultValue={selectedDoctor.name}
            className="p-2 border border-input rounded bg-background text-sm"
            placeholder="Full Name"
            required
          />
          <input
            name="specialization"
            defaultValue={selectedDoctor.specialization}
            className="p-2 border border-input rounded bg-background text-sm"
            placeholder="Specialization"
            required
          />
          <input
            name="hospital"
            defaultValue={selectedDoctor.hospital}
            className="p-2 border border-input rounded bg-background text-sm"
            placeholder="Hospital"
            required
          />
          <input
            name="phone"
            defaultValue={selectedDoctor.phone}
            className="p-2 border border-input rounded bg-background text-sm"
            placeholder="Phone"
            required
          />
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
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Specialization:</strong> {selectedDoctor.specialization}
          </p>
          <p className="text-sm">
            <strong>Hospital:</strong> {selectedDoctor.hospital}
          </p>
          <p className="text-sm">
            <strong>Phone:</strong> {selectedDoctor.phone}
          </p>
          <p className="text-sm">
            <strong>Email:</strong> {selectedDoctor.email}
          </p>
        </div>
      )}
    </div>
  );
}
