import { cookies } from "next/headers";
import { IUserProfile } from "@/types";

export async function getCurrentUser(): Promise<IUserProfile | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000/api/v1";
    const res = await fetch(`${backendUrl}/user/me`, {
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
