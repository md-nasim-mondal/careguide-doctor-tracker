import Link from "next/link";
import type { PatientFilterBarProps } from "@/types";

export default function PatientFilterBar({
  search,
  condition,
  date,
  conditionsList = [],
  showAddForm,
  buildQuery,
}: PatientFilterBarProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* URL Filter Form */}
      <form method="GET" action="/dashboard/patients" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
        <input
          name="search"
          placeholder="Search patients..."
          defaultValue={search}
          className="p-2.5 border border-input rounded-xl bg-card text-foreground text-xs sm:text-sm focus:ring-2 focus:ring-ring w-full min-w-0"
        />
        <select
          name="condition"
          defaultValue={condition}
          className="p-2.5 border border-input rounded-xl bg-card text-foreground text-xs sm:text-sm focus:ring-2 focus:ring-ring w-full min-w-0"
        >
          <option value="">All Conditions (Filter)</option>
          {conditionsList.map((cond) => (
            <option key={cond} value={cond}>
              {cond}
            </option>
          ))}
          {/* If the current query condition is not in conditionsList yet, render it as an option so selection is preserved */}
          {condition && !conditionsList.includes(condition) && (
            <option value={condition}>{condition}</option>
          )}
        </select>
        <input
          type="date"
          name="date"
          defaultValue={date}
          className="p-2.5 border border-input rounded-xl bg-card text-foreground text-xs sm:text-sm focus:ring-2 focus:ring-ring w-full min-w-0"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 font-semibold text-xs sm:text-sm cursor-pointer shadow-xs whitespace-nowrap"
          >
            Filter
          </button>
          <Link
            href="/dashboard/patients"
            className="px-4 py-2 bg-muted text-foreground border border-border rounded-xl hover:bg-muted/80 flex items-center justify-center text-xs sm:text-sm font-medium whitespace-nowrap"
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
            className="w-full sm:w-auto text-center px-4 py-2 bg-muted text-foreground border border-border rounded text-xs sm:text-sm font-medium"
          >
            Cancel
          </Link>
        ) : (
          <Link
            href={`/dashboard/patients${buildQuery({ action: "add", patientId: undefined })}`}
            className="w-full sm:w-auto text-center px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 text-xs sm:text-sm font-semibold shadow-xs"
          >
            + Add Patient
          </Link>
        )}
      </div>
    </div>
  );
}
