import { NextResponse } from "next/server";
import { resetPasswordValidationSchema, validateData } from "@/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Frontend Zod request validation
    const validation = validateData(resetPasswordValidationSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error },
        { status: 400 }
      );
    }

    const { token, id, code, newPassword } = validation.data;
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000/api/v1";

    if (!token) {
      return NextResponse.json(
        { message: "Reset authorization token is missing or expired" },
        { status: 400 }
      );
    }

    const response = await fetch(`${backendUrl}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, code, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Password reset failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Password has been reset successfully. You can now log in." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Internal server error connecting to backend" },
      { status: 500 }
    );
  }
}
