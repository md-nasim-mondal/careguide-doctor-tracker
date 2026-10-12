import Link from "next/link";
import { approveDoctorAction, deleteUserAction } from "@/actions/users";

import { type IUserItem } from "@/types";
export type { IUserItem };

interface UserTableRowProps {
  user: IUserItem;
  currentUserId: string;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export default function UserTableRow({
  user,
  currentUserId,
  buildQuery,
}: UserTableRowProps) {
  const isPendingDoctor = user.role === "DOCTOR" && user.isActive === "INACTIVE";

  // Clean, eye-pleasing role badges
  let roleBadgeClasses = "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/50";
  let roleIcon = "👤";
  let roleDisplay = "Patient";

  if (user.role === "SUPER_ADMIN") {
    roleBadgeClasses = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/50";
    roleIcon = "👑";
    roleDisplay = "Super Admin";
  } else if (user.role === "ADMIN") {
    roleBadgeClasses = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/50";
    roleIcon = "🛡️";
    roleDisplay = "Admin";
  } else if (user.role === "DOCTOR") {
    roleBadgeClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50";
    roleIcon = "👨‍⚕️";
    roleDisplay = "Doctor";
  }

  // Clean, eye-pleasing status badges
  let statusBadgeClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50";
  let statusDotClass = "bg-emerald-500 dark:bg-emerald-400";
  let statusDisplay = user.isActive;

  if (user.isActive === "INACTIVE") {
    statusBadgeClasses = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50";
    statusDotClass = "bg-amber-500 dark:bg-amber-400";
    statusDisplay = "Inactive";
  } else if (user.isActive === "BLOCKED") {
    statusBadgeClasses = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/50";
    statusDotClass = "bg-rose-500 dark:bg-rose-400";
    statusDisplay = "Blocked";
  }

  return (
    <tr className="hover:bg-muted/40 transition">
      <td className="py-3 px-4">
        <div className="font-semibold text-foreground">{user.name}</div>
        <div className="text-xs text-muted-foreground">{user.email}</div>
        {user.phone && <div className="text-[11px] text-muted-foreground">{user.phone}</div>}
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${roleBadgeClasses}`}>
          <span className="text-[11px]">{roleIcon}</span>
          <span>{roleDisplay}</span>
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-2xs ${statusBadgeClasses}`}>
          <span className={`w-2 h-2 rounded-full ${statusDotClass}`}></span>
          <span>{statusDisplay}</span>
        </span>
      </td>
      <td className="py-3 px-4">
        {user.isVerified ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50">
            <span>✓</span> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50">
            Unverified
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-xs text-muted-foreground">
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {isPendingDoctor && (
            <form
              action={async () => {
                "use server";
                await approveDoctorAction(user._id);
              }}
            >
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-xs cursor-pointer"
                title="Approve Doctor account"
              >
                ✓ Approve Doctor
              </button>
            </form>
          )}
          <Link
            href={`/dashboard/users${buildQuery({ action: "edit", userId: user._id })}`}
            className="px-2.5 py-1 text-[11px] font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border rounded"
          >
            Edit Role
          </Link>
          {user._id !== currentUserId && (
            <form
              action={async () => {
                "use server";
                await deleteUserAction(user._id);
              }}
            >
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] font-semibold bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 dark:border-rose-900 rounded transition cursor-pointer"
                title="Delete user"
              >
                Delete
              </button>
            </form>
          )}
        </div>
      </td>
    </tr>
  );
}
