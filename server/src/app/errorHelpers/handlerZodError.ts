import { ZodError, ZodIssue } from "zod";
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";

export const handlerZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  err.issues.forEach((issue: ZodIssue) => {
    errorSources.push({
      path: String(issue.path[issue.path.length - 1] ?? ""),
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Zod Error",
    errorSources,
  };
};
