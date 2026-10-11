import Link from "next/link";
import type { DoctorSearchBarProps } from "@/types";

export default function DoctorSearchBar({
  search,
  showAddForm,
  buildQuery,
}: DoctorSearchBarProps) {
  return (
    <div className="flex justify-between items-center mb-6 gap-4">
      <form method="GET" action="/dashboard/doctors" className="w-1/2 flex gap-2">
        <input
          type="text"
          name="search"
          placeholder="Search doctors..."
          defaultValue={search}
          className="flex-1 p-3 bg-card border border-border rounded text-foreground focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 font-medium text-sm"
        >
          Search
        </button>
        {search && (
          <Link
            href="/dashboard/doctors"
            className="px-3 py-2 bg-muted text-foreground border border-border rounded hover:bg-muted/80 flex items-center text-sm"
          >
            Clear
          </Link>
        )}
      </form>

      <div>
        {showAddForm ? (
          <Link
            href={`/dashboard/doctors${buildQuery({ action: undefined })}`}
            className="px-4 py-2 bg-muted text-foreground border border-border rounded hover:bg-muted/80 text-sm font-medium inline-block"
          >
            Cancel
          </Link>
        ) : (
          <Link
            href={`/dashboard/doctors${buildQuery({ action: "add", doctorId: undefined })}`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 text-sm font-medium inline-block"
          >
            Add Doctor
          </Link>
        )}
      </div>
    </div>
  );
}
