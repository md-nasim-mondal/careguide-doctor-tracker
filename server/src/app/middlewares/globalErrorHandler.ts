import { ErrorRequestHandler } from "express";
import httpStatus from "http-status-codes";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleCastError } from "../errorHelpers/handleCastError";
import { handlerDuplicateError } from "../errorHelpers/handleDuplicateError";
import { handlerValidationError } from "../errorHelpers/handlerValidationError";
import { handlerZodError } from "../errorHelpers/handlerZodError";
import { TErrorSources } from "../interfaces/error.types";

interface TGlobalError extends Error {
  statusCode?: number;
  code?: number;
  errorSources?: TErrorSources[];
}

export const globalErrorHandler: ErrorRequestHandler = async (
  err,
  req,
  res,
  _next
) => {
  const error = err as TGlobalError;

  if (envVars.NODE_ENV === "development") {
    console.log(error);
  }

  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = "Something Went Wrong!!";

  //Duplicate error
  if (error.code === 11000) {
    const simplifiedError = handlerDuplicateError(error);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
  }
  // Object ID error / Cast Error
  else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error as unknown as mongoose.Error.CastError);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
  } else if (error.name === "ZodError") {
    const simplifiedError = handlerZodError(error as unknown as ZodError);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  //Mongoose Validation Error
  else if (error.name === "ValidationError") {
    const simplifiedError = handlerValidationError(error as unknown as mongoose.Error.ValidationError);
    statusCode = simplifiedError.statusCode as number;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = simplifiedError.message;
  } else if (error instanceof TokenExpiredError || error.name === "TokenExpiredError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Token has expired";
  } else if (error instanceof JsonWebTokenError || error.name === "JsonWebTokenError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Invalid or malformed token";
  } else if (error instanceof NotBeforeError || error.name === "NotBeforeError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Token not active yet";
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = envVars.NODE_ENV === "production" ? "Internal server error" : error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? error : null,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
