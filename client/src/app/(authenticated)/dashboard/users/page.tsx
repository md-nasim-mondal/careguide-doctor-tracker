import { redirect } from "next/navigation";
import Link from "next/link";
import { getMeAction } from "@/actions/auth";
import { getAllUsersAction, updateUserRoleAction, approveDoctorAction, deleteUserAction } from "@/actions/users";
import AlertBanner from "@/components/common/AlertBanner";

export const instant = false;

interface PageProps {
  searchParams: Promise<{
    searchTerm?: string;
    role?: string;
    isActive?: string;
    page?: string;
    action?: string;
    userId?: string;
    error?: string;
    success?: string;
  }>;
}

export default async function UserManagementPage({ searchParams }: PageProps) {
  const user = await getMeAction();
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const searchTerm = resolvedParams.searchTerm || "";
  const roleFilter = resolvedParams.role || "";
  const statusFilter = resolvedParams.isActive || "";
  const action = resolvedParams.action || "";
  const selectedUserId = resolvedParams.userId || "";
  const errorMsg = resolvedParams.error || "";
  const successMsg = resolvedParams.success || "";

  const usersResponse = await getAllUsersAction({
    searchTerm,
    role: roleFilter,
    isActive: statusFilter,
    page,
    limit: 10,
  });

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };
  const totalPages = meta.totalPage || 1;

  const buildQuery = (params: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    if (searchTerm) sp.set("searchTerm", searchTerm);
    if (roleFilter) sp.set("role", roleFilter);
    if (statusFilter) sp.set("isActive", statusFilter);
    if (page > 1) sp.set("page", page.toString());

    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") {
        sp.set(k, v.toString());
      } else {
        sp.delete(k);
      }
    });
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  };

  const editingUser = users.find((u: { _id: string }) => u._id === selectedUserId);

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto text-foreground bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage system users, approve registered doctors, update roles, and control account statuses.
          </p>
        </div>
        <div className="text-xs sm:text-sm font-medium bg-muted px-3 py-1.5 rounded-lg border border-border">
          Total Users: <span className="font-bold text-foreground">{meta.total}</span>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4">
          <AlertBanner variant="success" message={successMsg} />
        </div>
      )}

      {errorMsg && (
        <div className="mb-4">
          <AlertBanner variant="error" message={errorMsg} />
        </div>
      )}

      {/* Filter and Search Bar */}
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

      {/* Edit Role / Status Modal/Form if action=edit */}
      {action === "edit" && editingUser && (
        <div className="mb-6 p-4 sm:p-6 bg-card border-2 border-primary/40 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Edit User: {editingUser.name}
              </h2>
              <p className="text-xs text-muted-foreground">{editingUser.email}</p>
            </div>
            <Link
              href={`/dashboard/users${buildQuery({ action: undefined, userId: undefined })}`}
              className="text-muted-foreground hover:text-foreground text-sm font-bold p-1"
            >
              ✕ Cancel
            </Link>
          </div>
          <form
            action={async (formData: FormData) => {
              "use server";
              await updateUserRoleAction(editingUser._id, formData);
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Role</label>
              <select
                name="role"
                defaultValue={editingUser.role}
                className="w-full p-2.5 border border-input rounded-lg bg-background text-foreground text-xs sm:text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="PATIENT">Patient (PATIENT)</option>
                <option value="DOCTOR">Doctor / Specialist (DOCTOR)</option>
                <option value="ADMIN">Administrator</option>
                {user.role === "SUPER_ADMIN" && <option value="SUPER_ADMIN">Super Administrator</option>}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Account Status</label>
              <select
                name="isActive"
                defaultValue={editingUser.isActive}
                className="w-full p-2.5 border border-input rounded-lg bg-background text-foreground text-xs sm:text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <Link
                href={`/dashboard/users${buildQuery({ action: undefined, userId: undefined })}`}
                className="px-4 py-2 text-xs sm:text-sm rounded-lg border border-border bg-muted hover:bg-muted/80 text-foreground"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 text-xs sm:text-sm rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/60 text-muted-foreground uppercase text-[11px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3.5 px-4 font-semibold">User</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Verified</th>
                <th className="py-3.5 px-4 font-semibold">Registered</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                users.map((u: {
                  _id: string;
                  name: string;
                  email: string;
                  phone?: string;
                  role: string;
                  isActive: string;
                  isVerified: boolean;
                  createdAt?: string;
                }) => {
                  const isPendingDoctor = u.role === "DOCTOR" && u.isActive === "INACTIVE";

                  let roleBadgeStyle = "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
                  let roleDisplay = "Patient";
                  if (u.role === "SUPER_ADMIN") {
                    roleBadgeStyle = "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300";
                    roleDisplay = "Super Admin";
                  } else if (u.role === "ADMIN") {
                    roleBadgeStyle = "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300";
                    roleDisplay = "Admin";
                  } else if (u.role === "DOCTOR") {
                    roleBadgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300";
                    roleDisplay = "Doctor / Specialist";
                  }

                  let statusBadgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300";
                  if (u.isActive === "INACTIVE") {
                    statusBadgeStyle = "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";
                  } else if (u.isActive === "BLOCKED") {
                    statusBadgeStyle = "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300";
                  }

                  return (
                    <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground">{u.email}</div>
                        {u.phone && <div className="text-[11px] text-muted-foreground">{u.phone}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${roleBadgeStyle}`}>
                          {roleDisplay}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeStyle}`}>
                          {u.isActive}
                        </span>
                        {isPendingDoctor && (
                          <span className="block text-[10px] text-amber-600 font-medium mt-0.5">
                            Needs Approval
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-medium ${u.isVerified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {u.isVerified ? "✓ Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {isPendingDoctor && (
                            <form
                              action={async () => {
                                "use server";
                                await approveDoctorAction(u._id);
                              }}
                            >
                              <button
                                type="submit"
                                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-xs"
                                title="Approve Doctor account"
                              >
                                ✓ Approve Doctor
                              </button>
                            </form>
                          )}
                          <Link
                            href={`/dashboard/users${buildQuery({ action: "edit", userId: u._id })}`}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border rounded"
                          >
                            Edit Role
                          </Link>
                          {u._id !== user._id && (
                            <form
                              action={async () => {
                                "use server";
                                await deleteUserAction(u._id);
                              }}
                            >
                              <button
                                type="submit"
                                className="px-2.5 py-1 text-[11px] font-semibold bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 dark:border-rose-900 rounded transition"
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
            <div className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-1.5">
              {page > 1 && (
                <Link
                  href={`/dashboard/users${buildQuery({ page: page - 1 })}`}
                  className="px-3 py-1 text-xs border border-border rounded bg-muted hover:bg-muted/80 text-foreground"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/dashboard/users${buildQuery({ page: page + 1 })}`}
                  className="px-3 py-1 text-xs border border-border rounded bg-muted hover:bg-muted/80 text-foreground"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
