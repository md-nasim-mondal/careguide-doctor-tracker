"use server";
import { fetchServerApi } from "@/lib/serverApi";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPatientValidationSchema,
  updatePatientValidationSchema,
  validateFormData,
} from "@/validations";

export async function createPatientAction(formData: FormData) {
  const validation = validateFormData(createPatientValidationSchema, formData);
  if (!validation.success) {
    redirect(`/dashboard/patients?action=add&error=${encodeURIComponent(validation.error)}`);
  }

  const { name, age, condition, doctor } = validation.data;

  let redirectUrl = "/dashboard/patients";
  try {
    await fetchServerApi("/patients", {
      method: "POST",
      body: JSON.stringify({ name, age, condition, doctor }),
    });
    revalidatePath("/dashboard/patients");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/patients?action=add&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function updatePatientAction(id: string, formData: FormData) {
  const validation = validateFormData(updatePatientValidationSchema, formData);
  if (!validation.success) {
    redirect(`/dashboard/patients?action=edit&patientId=${id}&error=${encodeURIComponent(validation.error)}`);
  }

  const { name, age, condition, doctor } = validation.data;

  let redirectUrl = "/dashboard/patients";
  try {
    await fetchServerApi(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, age, condition, doctor }),
    });
    revalidatePath("/dashboard/patients");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/patients?action=edit&patientId=${id}&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function deletePatientAction(id: string) {
  let redirectUrl = "/dashboard/patients";
  try {
    await fetchServerApi(`/patients/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/patients");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/patients?error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}
