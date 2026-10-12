export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  isVerified?: boolean;
  isActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoginResponse {
  message: string;
  user?: IUserProfile;
}

export interface AuthErrorMessage {
  path?: string;
  message?: string;
}

export interface AuthApiResponse<T = unknown> {
  success?: boolean;
  statusCode?: number;
  message?: string;
  errorMessages?: AuthErrorMessage[];
  error?: string;
  data?: T;
}

export interface LoginApiData {
  accessToken?: string;
  needsPasswordChange?: boolean;
}
