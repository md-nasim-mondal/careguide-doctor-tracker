import { z } from "zod";

const createPatientValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Patient name must be a string" })
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    age: z
      .number({ message: "Age must be a number" })
      .int("Age must be an integer")
      .positive("Age must be positive")
      .max(130, "Age cannot exceed 130"),
    condition: z
      .string({ message: "Condition must be a string" })
      .min(2, "Condition must be at least 2 characters"),
    doctor: z
      .string({ message: "Doctor ID must be a string" })
      .regex(/^[0-9a-fA-F]{24}$/, "Doctor ID must be a valid 24-character hexadecimal ObjectId")
      .optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
  }),
});

const updatePatientValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    age: z.number().int().positive().max(130).optional(),
    condition: z.string().min(2).optional(),
    doctor: z
      .string({ message: "Doctor ID must be a string" })
      .regex(/^[0-9a-fA-F]{24}$/, "Doctor ID must be a valid 24-character hexadecimal ObjectId")
      .optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
  }),
});

export const PatientValidation = {
  createPatientValidationSchema,
  updatePatientValidationSchema,
};
