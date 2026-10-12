import { redirect } from "next/navigation";
import { getMeAction } from "@/actions/auth";
import { getAllUsersAction } from "@/actions/users";
import AlertBanner from "@/components/common/AlertBanner";
import UserFilterBar from "@/components/users/UserFilterBar";
import UserEditModal from "@/components/users/UserEditModal";
import UsersTable from "@/components/users/UsersTable";
import type { IUserItem } from "@/components/users/UserTableRow";

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

  const users: IUserItem[] = usersResponse?.data || [];
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

  const editingUser = users.find((u) => u._id === selectedUserId);

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto text-foreground bg-background min-h-screen">
      {/* Header */}
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

      {/* Notifications */}
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

      {/* Filter and Search Bar Component */}
      <UserFilterBar
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
      />

      {/* Edit Role / Status Modal Component */}
      {action === "edit" && editingUser && (
        <UserEditModal
          user={editingUser}
          currentUserRole={user.role}
          cancelHref={`/dashboard/users${buildQuery({ action: undefined, userId: undefined })}`}
        />
      )}

      {/* Users Table with Pagination Component */}
      <UsersTable
        users={users}
        currentUserId={user._id}
        page={page}
        totalPages={totalPages}
        buildQuery={buildQuery}
      />
    </div>
  );
}
