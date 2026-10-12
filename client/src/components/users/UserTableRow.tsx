import Link from "next/link";
import { approveDoctorAction, deleteUserAction } from "@/actions/users";

export interface IUserItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: string;
  isVerified: boolean;
  createdAt?: string;
}

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

  let roleBadgeStyle = "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
  let roleDisplay = "Patient";
  if (user.role === "SUPER_ADMIN") {
    roleBadgeStyle = "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300";
    roleDisplay = "Super Admin";
  } else if (user.role === "ADMIN") {
    roleBadgeStyle = "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300";
    roleDisplay = "Admin";
  } else if (user.role === "DOCTOR") {
    roleBadgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300";
    roleDisplay = "Doctor / Specialist";
  }

  let statusBadgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (user.isActive === "INACTIVE") {
    statusBadgeStyle = "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";
  } else if (user.isActive === "BLOCKED") {
    statusBadgeStyle = "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300";
  }

  return (
    <tr className="hover:bg-muted/40 transition">
      <td className="py-3 px-4">
        <div className="font-semibold text-foreground">{user.name}</div>
        <div className="text-xs text-muted-foreground">{user.email}</div>
        {user.phone && <div className="text-[11px] text-muted-foreground">{user.phone}</div>}
      </td>
      <td className="py-3 px-4">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleBadgeStyle}`}>
          {roleDisplay}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeStyle}`}>
          {user.isActive}
        </span>
      </td>
      <td className="py-3 px-4">
        {user.isVerified ? (
          <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
            <span>✓</span> Verified
          </span>
        ) : (
          <span className="text-amber-600 font-medium text-xs">Unverified</span>
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
