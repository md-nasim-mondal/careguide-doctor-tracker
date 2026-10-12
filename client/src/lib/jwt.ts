export interface DecodedToken {
  userId?: string;
  userName?: string;
  email?: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'PATIENT' | string;
  exp?: number;
}

/**
 * Safely decodes base64url JWT payload in Edge runtime without external dependencies.
 */
export function parseJwtPayload(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
