import Link from "next/link";
import { updateUserRoleAction } from "@/actions/users";

interface UserEditModalProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: string;
  };
  currentUserRole: string;
  cancelHref: string;
}

export default function UserEditModal({
  user,
  currentUserRole,
  cancelHref,
}: UserEditModalProps) {
  return (
    <div className="mb-6 p-4 sm:p-6 bg-card border-2 border-primary/40 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Edit User: {user.name}
          </h2>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <Link
          href={cancelHref}
          className="text-muted-foreground hover:text-foreground text-sm font-bold p-1"
        >
          ✕ Cancel
        </Link>
      </div>
      <form
        action={async (formData: FormData) => {
          "use server";
          await updateUserRoleAction(user._id, formData);
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Role</label>
          <select
            name="role"
            defaultValue={user.role}
            className="w-full p-2.5 border border-input rounded-lg bg-background text-foreground text-xs sm:text-sm focus:ring-2 focus:ring-ring"
          >
            <option value="PATIENT">Patient (PATIENT)</option>
            <option value="DOCTOR">Doctor / Specialist (DOCTOR)</option>
            <option value="ADMIN">Administrator</option>
            {currentUserRole === "SUPER_ADMIN" && <option value="SUPER_ADMIN">Super Administrator</option>}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Status</label>
          <select
            name="isActive"
            defaultValue={user.isActive}
            className="w-full p-2.5 border border-input rounded-lg bg-background text-foreground text-xs sm:text-sm focus:ring-2 focus:ring-ring"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE (Pending Approval)</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
        <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
          <Link
            href={cancelHref}
            className="w-full sm:w-auto text-center px-4 py-2 text-xs sm:text-sm rounded-lg border border-border bg-muted hover:bg-muted/80 text-foreground"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 shadow-xs cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
