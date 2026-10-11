import Link from "next/link";
import type { DoctorSearchBarProps } from "@/types";

export default function DoctorSearchBar({
  search,
  showAddForm,
  buildQuery,
}: DoctorSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-3">
      <form method="GET" action="/dashboard/doctors" className="w-full sm:w-auto sm:flex-1 max-w-md flex gap-2">
        <input
          type="text"
          name="search"
          placeholder="Search doctors..."
          defaultValue={search}
          className="flex-1 min-w-0 p-2.5 sm:p-3 bg-card border border-border rounded text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="px-3.5 sm:px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 font-semibold text-xs sm:text-sm shrink-0 cursor-pointer"
        >
          Search
        </button>
        {search && (
          <Link
            href="/dashboard/doctors"
            className="px-3 py-2 bg-muted text-foreground border border-border rounded hover:bg-muted/80 flex items-center text-xs sm:text-sm shrink-0"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="flex">
        {showAddForm ? (
          <Link
            href={`/dashboard/doctors${buildQuery({ action: undefined })}`}
            className="w-full sm:w-auto text-center px-4 py-2 bg-muted text-foreground border border-border rounded hover:bg-muted/80 text-xs sm:text-sm font-medium"
          >
            Cancel
          </Link>
        ) : (
          <Link
            href={`/dashboard/doctors${buildQuery({ action: "add", doctorId: undefined })}`}
            className="w-full sm:w-auto text-center px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 text-xs sm:text-sm font-semibold shadow-xs"
          >
            + Add Doctor
          </Link>
        )}
      </div>
    </div>
  );
}
