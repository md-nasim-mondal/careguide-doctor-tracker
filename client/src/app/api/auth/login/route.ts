import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000/api/v1";

    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Authentication failed" },
        { status: response.status }
      );
    }

    const nextResponse = NextResponse.json(
      { message: "Login successful", user: data.data?.user || null },
      { status: 200 }
    );

    // Set the HttpOnly cookie
    nextResponse.cookies.set({
      name: "token",
      value: data.data.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day mapping
    });

    return nextResponse;
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Internal server error connecting to backend" },
      { status: 500 }
    );
  }
}
