import { z } from "zod";

const createContactValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Name must be a string" })
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name cannot exceed 100 characters"),
    hospital: z
      .string({ message: "Hospital name must be a string" })
      .min(2, "Hospital name must be at least 2 characters long"),
    email: z
      .string({ message: "Email must be a string" })
      .email("Invalid email format"),
    topic: z
      .string({ message: "Topic must be a string" })
      .min(2, "Topic must be at least 2 characters long"),
    message: z
      .string({ message: "Message must be a string" })
      .min(5, "Message must be at least 5 characters long"),
  }),
});

export const ContactValidation = {
  createContactValidationSchema,
};
