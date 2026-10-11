import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthenticated", user: null },
        { status: 401 }
      );
    }

    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000/api/v1";

    const response = await fetch(`${backendUrl}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch user profile", user: null },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Success", user: data.data?.data || data.data || null },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Internal server error connecting to backend", user: null },
      { status: 500 }
    );
  }
}
