import { cookies } from "next/headers";
import type { ApiResponse } from "@/types";

export const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api/v1';

/**
 * Normalizes any error or network failure into a clear, user-friendly message
 */
export function formatErrorMessage(err: unknown, fallbackMessage = "An unexpected error occurred."): string {
  if (!err) return fallbackMessage;

  const rawMessage = err instanceof Error ? err.message : String(err);

  // Check for common connection and network failure patterns
  if (
    rawMessage.includes("fetch failed") ||
    rawMessage.includes("ECONNREFUSED") ||
    rawMessage.includes("ENOTFOUND") ||
    rawMessage.includes("Failed to fetch") ||
    rawMessage.includes("connect ECONNREFUSED") ||
    rawMessage.includes("UND_ERR_CONNECT_TIMEOUT")
  ) {
    return "Healthcare server is currently offline or unreachable (port 5000). Please ensure the backend server is running.";
  }

  if (rawMessage.includes("ETIMEDOUT") || rawMessage.includes("Timeout")) {
    return "Connection to the backend server timed out. Please try again.";
  }

  return rawMessage || fallbackMessage;
}

export async function fetchServerApi(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: unknown) {
    throw new Error(formatErrorMessage(err));
  }

  let data: Record<string, any> | null = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response (e.g. 502/503 from reverse proxy or server crash)
    throw new Error(
      `Server responded with status ${response.status} (${response.statusText || 'Unable to parse server response'}).`
    );
  }

  if (!response.ok || !data) {
    const errorDetail =
      data?.message ||
      data?.errorMessages?.[0]?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(errorDetail);
  }

  return data;
}
