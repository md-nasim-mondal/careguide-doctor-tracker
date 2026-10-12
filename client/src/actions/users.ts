"use server";

import { fetchServerApi } from "@/lib/serverApi";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { IUserItem } from "@/types";

export interface IGetUsersParams {
  searchTerm?: string;
  role?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}

async function requireAdmin() {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")) {
    redirect("/dashboard?unauthorized=admin_required");
  }
  return currentUser;
}

export async function getAllUsersAction(params: IGetUsersParams = {}) {
  await requireAdmin();

  const query = new URLSearchParams();
  if (params.searchTerm && params.searchTerm.trim()) query.append("searchTerm", params.searchTerm.trim());
  if (params.role && params.role.trim()) query.append("role", params.role.trim());
  if (params.isActive && params.isActive.trim()) query.append("isActive", params.isActive.trim());
  if (params.page && params.page > 1) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());

  try {
    const res = await fetchServerApi<IUserItem[]>(`/user/all-users?${query.toString()}`, {
      cache: "no-store",
    });
    return {
      data: res.data || [],
      meta: res.meta || { page: 1, limit: 10, total: 0, totalPage: 1 },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch users";
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 }, error: message };
  }
}

export async function updateUserRoleAction(userId: string, formData: FormData) {
  await requireAdmin();

  const role = formData.get("role") as string;
  const isActive = formData.get("isActive") as string;

  let redirectUrl = "/dashboard/users?success=" + encodeURIComponent("User updated successfully!");
  try {
    const payload: Record<string, unknown> = {};
    if (role) payload.role = role;
    if (isActive) payload.isActive = isActive;

    await fetchServerApi(`/user/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    revalidatePath("/dashboard/users");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update user";
    redirectUrl = `/dashboard/users?error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function approveDoctorAction(userId: string) {
  await requireAdmin();

  let redirectUrl = "/dashboard/users?success=" + encodeURIComponent("Doctor approved successfully! Doctor can now log in.");
  try {
    await fetchServerApi(`/user/${userId}/approve-doctor`, {
      method: "PATCH",
    });
    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to approve doctor";
    redirectUrl = `/dashboard/users?error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function deleteUserAction(userId: string) {
  await requireAdmin();

  let redirectUrl = "/dashboard/users?success=" + encodeURIComponent("User deleted successfully!");
  try {
    await fetchServerApi(`/user/${userId}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/users");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete user";
    redirectUrl = `/dashboard/users?error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}
