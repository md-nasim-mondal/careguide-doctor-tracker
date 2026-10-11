"use server";
import { fetchServerApi } from "@/lib/serverApi";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPatientAction(formData: FormData) {
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string, 10);
  const condition = formData.get("condition") as string;
  const doctor = formData.get("doctor") as string;

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
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string, 10);
  const condition = formData.get("condition") as string;
  const doctor = formData.get("doctor") as string;

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
