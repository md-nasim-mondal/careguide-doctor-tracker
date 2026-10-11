"use server";
import { fetchServerApi } from "@/lib/serverApi";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDoctorAction(formData: FormData) {
  const name = formData.get("name") as string;
  const specialization = formData.get("specialization") as string;
  const hospital = formData.get("hospital") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  let redirectUrl = "/doctors";
  try {
    await fetchServerApi("/doctors", {
      method: "POST",
      body: JSON.stringify({ name, specialization, hospital, phone, email }),
    });
    revalidatePath("/doctors");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/doctors?action=add&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function updateDoctorAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const specialization = formData.get("specialization") as string;
  const hospital = formData.get("hospital") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  let redirectUrl = `/doctors?doctorId=${id}`;
  try {
    await fetchServerApi(`/doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, specialization, hospital, phone, email }),
    });
    revalidatePath("/doctors");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/doctors?doctorId=${id}&action=edit&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function deleteDoctorAction(id: string) {
  let redirectUrl = "/doctors";
  try {
    await fetchServerApi(`/doctors/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/doctors");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/doctors?error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}

export async function removePatientFromDoctorAction(doctorId: string, patientId: string) {
  let redirectUrl = `/doctors?doctorId=${doctorId}`;
  try {
    await fetchServerApi(`/doctors/${doctorId}/patients/${patientId}`, {
      method: "DELETE"
    });
    revalidatePath("/doctors");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    redirectUrl = `/doctors?doctorId=${doctorId}&error=${encodeURIComponent(message)}`;
  }
  redirect(redirectUrl);
}
