import { cookies } from "next/headers";

export const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api/v1';

export async function fetchServerApi(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = token;
  }

  const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }
  return data;
}
