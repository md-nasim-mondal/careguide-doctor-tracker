"use server";
import { fetchServerApi } from "@/lib/serverApi";
import { revalidatePath } from "next/cache";

export async function createPatientAction(formData: FormData) {
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string, 10);
  const condition = formData.get("condition") as string;
  const doctor = formData.get("doctor") as string;

  try {
    await fetchServerApi("/patients", {
      method: "POST",
      body: JSON.stringify({ name, age, condition, doctor }),
    });
    revalidatePath("/patients");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function updatePatientAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string, 10);
  const condition = formData.get("condition") as string;
  const doctor = formData.get("doctor") as string;

  try {
    await fetchServerApi(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, age, condition, doctor }),
    });
    revalidatePath("/patients");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function deletePatientAction(id: string) {
  try {
    await fetchServerApi(`/patients/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/patients");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}
