"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchServerApi, BACKEND_API_URL } from "@/lib/serverApi";
import {
  loginValidationSchema,
  registerValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
  changePasswordValidationSchema,
  validateFormData,
} from "@/validations";
import type { IUserProfile } from "@/types";

/**
 * SSR Server Action to retrieve currently authenticated user profile
 */
export async function getMeAction(): Promise<IUserProfile | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.data || json.data || null;
  } catch {
    return null;
  }
}

/**
 * Server Action for user registration with Zod validation
 */
export async function registerAction(formData: FormData) {
  const validation = validateFormData(registerValidationSchema, formData);
  if (!validation.success) {
    redirect(`/register?error=${encodeURIComponent(validation.error)}`);
  }

  const { name, email, password, phone } = validation.data;
  const address = formData.get("address") as string | null;

  try {
    const payload: Record<string, unknown> = { name, email, password };
    if (phone) payload.phone = phone;
    if (address && address.trim()) payload.address = address.trim();

    const response = await fetch(`${BACKEND_API_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    redirect(`/register?error=${encodeURIComponent(message)}`);
  }

  redirect(`/login?success=${encodeURIComponent("Account registered successfully! Please sign in.")}`);
}

/**
 * Server Action for user password reset with Zod validation
 */
export async function resetPasswordAction(formData: FormData) {
  const validation = validateFormData(resetPasswordValidationSchema, formData);
  if (!validation.success) {
    redirect(`/reset-password?error=${encodeURIComponent(validation.error)}`);
  }

  const { id, code, newPassword, token } = validation.data;
  const authToken = token || (formData.get("token") as string);

  if (!authToken) {
    redirect(`/reset-password?error=${encodeURIComponent("Reset authorization token is missing or expired")}`);
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ id, code, newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Password reset failed");
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Password reset failed";
    redirect(`/reset-password?id=${id}&token=${encodeURIComponent(authToken)}&error=${encodeURIComponent(message)}`);
  }

  redirect(`/login?success=${encodeURIComponent("Password has been reset successfully! You can now log in.")}`);
}

/**
 * Server Action for changing password (authenticated) with Zod validation
 */
export async function changePasswordAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect(`/login?error=${encodeURIComponent("You are not authenticated")}`);
  }

  const validation = validateFormData(changePasswordValidationSchema, formData);
  if (!validation.success) {
    redirect(`/dashboard/change-password?error=${encodeURIComponent(validation.error)}`);
  }

  const { oldPassword, newPassword } = validation.data;

  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to change password");
    }

    revalidatePath("/dashboard/change-password");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to change password";
    redirect(`/dashboard/change-password?error=${encodeURIComponent(message)}`);
  }

  redirect(`/dashboard/change-password?success=${encodeURIComponent("Your password has been changed successfully!")}`);
}

/**
 * Server Action for forgot password request with Zod validation
 */
export async function forgotPasswordAction(formData: FormData) {
  const validation = validateFormData(forgotPasswordValidationSchema, formData);
  if (!validation.success) {
    redirect(`/forgot-password?error=${encodeURIComponent(validation.error)}`);
  }

  const { email } = validation.data;

  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to process forgot password request");
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process forgot password request";
    redirect(`/forgot-password?error=${encodeURIComponent(message)}`);
  }

  redirect(`/forgot-password?success=${encodeURIComponent("Password reset instructions sent! Please check your email or server terminal in local development mode.")}`);
}

/**
 * Server Action for logout with cookie clearance
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login?success=" + encodeURIComponent("You have been logged out."));
}
