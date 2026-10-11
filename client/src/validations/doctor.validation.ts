import { z } from "zod";

export const createDoctorValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Doctor name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),
  specialization: z
    .string()
    .min(2, "Specialization must be at least 2 characters long"),
  hospital: z
    .string()
    .min(2, "Hospital name must be at least 2 characters long"),
  phone: z
    .string()
    .min(5, "Phone number must be at least 5 characters"),
  email: z
    .string()
    .email("Invalid email address format"),
});

export const updateDoctorValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  specialization: z.string().min(2, "Specialization must be at least 2 characters").optional(),
  hospital: z.string().min(2, "Hospital must be at least 2 characters").optional(),
  phone: z.string().min(5, "Phone must be at least 5 characters").optional(),
  email: z.string().email("Invalid email address format").optional(),
});

export const addPatientToDoctorValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Patient name must be at least 2 characters long"),
  age: z.coerce
    .number()
    .int("Age must be an integer")
    .positive("Age must be a positive number")
    .max(130, "Age cannot exceed 130"),
  condition: z
    .string()
    .min(2, "Condition must be at least 2 characters long"),
});
