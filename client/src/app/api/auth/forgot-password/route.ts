import { NextResponse } from "next/server";
import { forgotPasswordValidationSchema, validateData } from "@/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Frontend Zod request validation
    const validation = validateData(forgotPasswordValidationSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000/api/v1";

    const response = await fetch(`${backendUrl}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to process forgot password request" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Password reset instructions sent. Please check your email or console in development mode." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Internal server error connecting to backend" },
      { status: 500 }
    );
  }
}
