import { z, ZodError } from "zod";

export function formatZodError(error: ZodError): string {
  return error.issues.map((issue) => issue.message).join(", ") || "Validation failed";
}

export function validateData<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: formatZodError(result.error),
    };
  }
  return {
    success: true,
    data: result.data,
  };
}

export function validateFormData<T>(
  schema: z.ZodType<T>,
  formData: FormData
): { success: true; data: T } | { success: false; error: string } {
  const obj: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return validateData(schema, obj);
}
