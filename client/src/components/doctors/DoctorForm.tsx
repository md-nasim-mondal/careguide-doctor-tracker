import Link from "next/link";
import { createDoctorAction } from "@/actions/doctors";
import type { DoctorFormProps } from "@/types";

export default function DoctorForm({ buildQuery }: DoctorFormProps) {
  return (
    <form
      action={createDoctorAction}
      className="bg-card p-6 border border-border rounded mb-6 grid grid-cols-2 gap-4 text-foreground shadow-sm"
    >
      <input
        name="name"
        className="p-2 border border-input rounded bg-background"
        placeholder="Full Name"
        required
      />
      <input
        name="specialization"
        className="p-2 border border-input rounded bg-background"
        placeholder="Specialization"
        required
      />
      <input
        name="hospital"
        className="p-2 border border-input rounded bg-background"
        placeholder="Hospital"
        required
      />
      <input
        name="phone"
        className="p-2 border border-input rounded bg-background"
        placeholder="Phone"
        required
      />
      <input
        name="email"
        type="email"
        className="p-2 border border-input rounded bg-background"
        placeholder="Email"
        required
      />
      <div className="col-span-2 flex justify-end gap-2">
        <Link
          href={`/dashboard/doctors${buildQuery({ action: undefined })}`}
          className="px-4 py-2 border border-border rounded hover:bg-muted text-sm font-medium flex items-center"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="px-6 py-2 bg-success text-success-foreground rounded hover:opacity-90 font-medium text-sm"
        >
          Save Doctor
        </button>
      </div>
    </form>
  );
}
