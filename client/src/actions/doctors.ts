"use server";
import { fetchServerApi } from "@/lib/serverApi";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createDoctorValidationSchema,
  updateDoctorValidationSchema,
  addPatientToDoctorValidationSchema,
  validateFormData,
} from "@/validations";

export async function createDoctorAction(formData: FormData) {
  const validation = validateFormData(createDoctorValidationSchema, formData);
  if (!validation.success) {
    redirect(`/dashboard/doctors?action=add&error=${encodeURIComponent(validation.error)}`);
  }

  const { name, specialization, hospital, phone, email } = validation.data;

  let redirectUrl = "/dashboard/doctors";
  try {
    await fetchServerApi("/doctors", {
      method: "POST",
      body: JSON.stringify({ name, specialization, hospital, phone, email }),
    });
    revalidatePath("/dashboard/doctors");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/doctors?action=add&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function updateDoctorAction(id: string, formData: FormData) {
  const validation = validateFormData(updateDoctorValidationSchema, formData);
  if (!validation.success) {
    redirect(`/dashboard/doctors?doctorId=${id}&action=edit&error=${encodeURIComponent(validation.error)}`);
  }

  const { name, specialization, hospital, phone, email } = validation.data;

  let redirectUrl = `/dashboard/doctors?doctorId=${id}`;
  try {
    await fetchServerApi(`/doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, specialization, hospital, phone, email }),
    });
    revalidatePath("/dashboard/doctors");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/doctors?doctorId=${id}&action=edit&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function deleteDoctorAction(id: string) {
  let redirectUrl = "/dashboard/doctors";
  try {
    await fetchServerApi(`/doctors/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/doctors");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/doctors?error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function removePatientFromDoctorAction(doctorId: string, patientId: string) {
  let redirectUrl = `/dashboard/doctors?doctorId=${doctorId}`;
  try {
    await fetchServerApi(`/doctors/${doctorId}/patients/${patientId}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/doctors");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/doctors?doctorId=${doctorId}&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function addPatientToDoctorAction(doctorId: string, formData: FormData) {
  const validation = validateFormData(addPatientToDoctorValidationSchema, formData);
  if (!validation.success) {
    redirect(`/dashboard/doctors?doctorId=${doctorId}&action=add-patient&error=${encodeURIComponent(validation.error)}`);
  }

  const { name, age, condition } = validation.data;

  let redirectUrl = `/dashboard/doctors?doctorId=${doctorId}`;
  try {
    await fetchServerApi(`/doctors/${doctorId}/patients`, {
      method: "POST",
      body: JSON.stringify({ name, age, condition }),
    });
    revalidatePath("/dashboard/doctors");
    revalidatePath("/dashboard/patients");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/dashboard/doctors?doctorId=${doctorId}&action=add-patient&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}
