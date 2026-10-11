import { z } from "zod";

export const createPatientValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Patient name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),
  age: z.coerce
    .number()
    .int("Age must be an integer")
    .positive("Age must be a positive number")
    .max(130, "Age cannot exceed 130"),
  condition: z
    .string()
    .min(2, "Condition must be at least 2 characters long"),
  doctor: z
    .string()
    .min(1, "Assigned doctor is required"),
});

export const updatePatientValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(100).optional(),
  age: z.coerce.number().int().positive().max(130).optional(),
  condition: z.string().min(2, "Condition must be at least 2 characters long").optional(),
  doctor: z.string().optional(),
});
