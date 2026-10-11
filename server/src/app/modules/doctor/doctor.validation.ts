import { z } from "zod";

const createDoctorValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Doctor name must be a string" })
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name cannot exceed 100 characters"),
    specialization: z
      .string({ message: "Specialization must be a string" })
      .min(2, "Specialization must be at least 2 characters long"),
    hospital: z
      .string({ message: "Hospital name must be a string" })
      .min(2, "Hospital name must be at least 2 characters long"),
    phone: z
      .string({ message: "Phone number must be a string" })
      .min(5, "Phone number must be at least 5 characters"),
    email: z
      .string({ message: "Email must be a string" })
      .email("Invalid email format"),
  }),
});

const updateDoctorValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    specialization: z.string().min(2).optional(),
    hospital: z.string().min(2).optional(),
    phone: z.string().min(5).optional(),
    email: z.string().email("Invalid email format").optional(),
  }),
});

const addPatientToDoctorValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Patient name must be a string" })
      .min(2, "Name must be at least 2 characters"),
    age: z
      .number({ message: "Age must be a number" })
      .int("Age must be an integer")
      .positive("Age must be positive")
      .max(130, "Age cannot exceed 130"),
    condition: z
      .string({ message: "Condition must be a string" })
      .min(2, "Condition must be at least 2 characters"),
  }),
});

export const DoctorValidation = {
  createDoctorValidationSchema,
  updateDoctorValidationSchema,
  addPatientToDoctorValidationSchema,
};
