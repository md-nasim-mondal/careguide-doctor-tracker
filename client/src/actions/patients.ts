"use server";
import { fetchServerApi } from "@/lib/serverApi";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPatientValidationSchema,
  updatePatientValidationSchema,
  validateFormData,
} from "@/validations";

export async function createPatientAction(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role === "PATIENT") {
    redirect(`/dashboard?unauthorized=patient_restricted`);
  }

  const validation = validateFormData(createPatientValidationSchema, formData);
  if (!validation.success) {
    redirect(`/dashboard/patients?action=add&error=${encodeURIComponent(validation.error)}`);
  }

  const { name, age, condition, doctor, email, phone } = validation.data;

  let redirectUrl = "/dashboard/patients?success=" + encodeURIComponent("Patient created successfully!");
  try {
    await fetchServerApi("/patients", {
      method: "POST",
      body: JSON.stringify({ name, age, condition, doctor, email: email || undefined, phone: phone || undefined }),
    });
    revalidatePath("/dashboard/patients");
    revalidatePath("/dashboard");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/patients?action=add&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function updatePatientAction(id: string, formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role === "PATIENT") {
    redirect(`/dashboard?unauthorized=patient_restricted`);
  }

  const validation = validateFormData(updatePatientValidationSchema, formData);
  if (!validation.success) {
    redirect(`/dashboard/patients?action=edit&patientId=${id}&error=${encodeURIComponent(validation.error)}`);
  }

  const { name, age, condition, doctor, email, phone } = validation.data;

  let redirectUrl = "/dashboard/patients?success=" + encodeURIComponent("Patient updated successfully!");
  try {
    await fetchServerApi(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, age, condition, doctor, email: email || undefined, phone: phone || undefined }),
    });
    revalidatePath("/dashboard/patients");
    revalidatePath("/dashboard");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/patients?action=edit&patientId=${id}&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function deletePatientAction(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")) {
    redirect(`/dashboard/patients?error=${encodeURIComponent("Unauthorized: Only administrators can delete patient records")}`);
  }

  let redirectUrl = "/dashboard/patients?success=" + encodeURIComponent("Patient deleted successfully!");
  try {
    await fetchServerApi(`/patients/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/patients");
    revalidatePath("/dashboard");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/patients?error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}
