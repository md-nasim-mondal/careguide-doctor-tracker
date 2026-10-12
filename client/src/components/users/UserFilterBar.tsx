import Link from "next/link";

interface UserFilterBarProps {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
}

export default function UserFilterBar({
  searchTerm,
  roleFilter,
  statusFilter,
}: UserFilterBarProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-xs">
      <form method="GET" action="/dashboard/users" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          name="searchTerm"
          placeholder="Search name, email, phone..."
          defaultValue={searchTerm}
          className="p-2.5 border border-input rounded-lg bg-background text-foreground text-xs sm:text-sm focus:ring-2 focus:ring-ring"
        />
        <select
          name="role"
          defaultValue={roleFilter}
          className="p-2.5 border border-input rounded-lg bg-background text-foreground text-xs sm:text-sm focus:ring-2 focus:ring-ring"
        >
          <option value="">All Roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
          <option value="DOCTOR">Doctor (DOCTOR)</option>
          <option value="PATIENT">Patient (PATIENT)</option>
        </select>
        <select
          name="isActive"
          defaultValue={statusFilter}
          className="p-2.5 border border-input rounded-lg bg-background text-foreground text-xs sm:text-sm focus:ring-2 focus:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE (Pending Approval)</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 text-xs sm:text-sm cursor-pointer shadow-xs"
          >
            Filter
          </button>
          <Link
            href="/dashboard/users"
            className="px-4 py-2 bg-muted text-foreground border border-border rounded-lg hover:bg-muted/80 flex items-center justify-center text-xs sm:text-sm font-medium"
          >
            Reset
          </Link>
        </div>
      </form>
    </div>
  );
}
