"use server";
import { redirect } from "next/navigation";

export async function submitContactInquiryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const hospital = formData.get("hospital") as string;
  const email = formData.get("email") as string;
  const topic = formData.get("topic") as string;
  const message = formData.get("message") as string;

  if (!name || !hospital || !email || !topic || !message) {
    redirect(`/contact?error=${encodeURIComponent("Please fill in all required fields.")}`);
  }

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000/api/v1";

  try {
    const res = await fetch(`${backendUrl}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, hospital, email, topic, message }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to submit inquiry");
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
    redirect(`/contact?error=${encodeURIComponent(msg)}`);
  }

  redirect("/contact?sent=true");
}
