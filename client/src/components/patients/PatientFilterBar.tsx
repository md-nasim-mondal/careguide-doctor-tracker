import Link from "next/link";
import type { PatientFilterBarProps } from "@/types";

export default function PatientFilterBar({
  search,
  condition,
  date,
  showAddForm,
  buildQuery,
}: PatientFilterBarProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* URL Filter Form */}
      <form method="GET" action="/dashboard/patients" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          name="search"
          placeholder="Search patients..."
          defaultValue={search}
          className="p-2 border border-input rounded bg-card text-foreground"
        />
        <input
          name="condition"
          placeholder="Filter condition..."
          defaultValue={condition}
          className="p-2 border border-input rounded bg-card text-foreground"
        />
        <input
          type="date"
          name="date"
          defaultValue={date}
          className="p-2 border border-input rounded bg-card text-foreground"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 font-medium text-sm cursor-pointer"
          >
            Filter
          </button>
          <Link
            href="/dashboard/patients"
            className="px-4 py-2 bg-muted text-foreground border border-border rounded hover:bg-muted/80 flex items-center justify-center text-sm font-medium"
          >
            Reset
          </Link>
        </div>
      </form>

      {/* Action Bar */}
      <div className="flex justify-end">
        {showAddForm ? (
          <Link
            href={`/dashboard/patients${buildQuery({ action: undefined })}`}
            className="px-4 py-2 bg-muted text-foreground border border-border rounded text-sm font-medium"
          >
            Cancel
          </Link>
        ) : (
          <Link
            href={`/dashboard/patients${buildQuery({ action: "add", patientId: undefined })}`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 text-sm font-medium"
          >
            Add Patient
          </Link>
        )}
      </div>
    </div>
  );
}
