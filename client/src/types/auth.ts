export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" | "SENDER" | "RECEIVER";

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
