import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[A-Z])/, "Password must contain at least 1 uppercase letter")
    .regex(/^(?=.*[!@#$%^&*])/, "Password must contain at least 1 special character")
    .regex(/^(?=.*\d)/, "Password must contain at least 1 number"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(?:\+8801\d{9}|01\d{9})$/.test(val),
      "Phone number must be valid for Bangladesh (e.g., 01XXXXXXXXX or +8801XXXXXXXXX)"
    ),
  role: z.enum(["RECEIVER", "SENDER"]).optional(),
  specialization: z.string().optional(),
  hospital: z.string().optional(),
});

export const forgotPasswordValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordValidationSchema = z.object({
  token: z.string().min(1, "Reset token is required").optional(),
  id: z.string().min(1, "User ID is required"),
  code: z.string().length(4, "Verification code must be 4 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const changePasswordValidationSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
