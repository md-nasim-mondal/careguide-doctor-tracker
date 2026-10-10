"use server";
import { fetchServerApi } from "@/lib/serverApi";
import { revalidatePath } from "next/cache";

export async function createDoctorAction(formData: FormData) {
  const name = formData.get("name") as string;
  const specialization = formData.get("specialization") as string;
  const hospital = formData.get("hospital") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  try {
    await fetchServerApi("/doctors", {
      method: "POST",
      body: JSON.stringify({ name, specialization, hospital, phone, email }),
    });
    revalidatePath("/doctors");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function removePatientFromDoctorAction(doctorId: string, patientId: string) {
  try {
    await fetchServerApi(`/doctors/${doctorId}/patients/${patientId}`, {
      method: "DELETE"
    });
    // For simplicity, we just trigger a generic refresh; Client Component handles specific state if needed.
    revalidatePath("/doctors");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}
