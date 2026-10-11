import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JsonWebTokenError, JwtPayload, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      let user: JwtPayload | undefined;

      if (envVars.AUTH_SYSTEM === "passport") {
        // In Passport, req.user is populated after successful session authentication
        if (!req.isAuthenticated() || !req.user) {
          throw new AppError(httpStatus.UNAUTHORIZED, "You are not authenticated");
        }
        
        const passportUser = req.user as IUser;
        user = {
          userId: passportUser._id?.toString() as string,
          email: passportUser.email,
          role: passportUser.role,
        };
      } else {
        // Custom JWT Authentication
        let accessToken = req.headers.authorization;

        if (!accessToken) {
          throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
        }

        if (accessToken.startsWith("Bearer ")) {
          accessToken = accessToken.slice(7).trim();
        }

        try {
          user = verifyToken(
            accessToken,
            envVars.JWT_ACCESS_SECRET
          ) as JwtPayload;
        } catch (err: unknown) {
          if (err instanceof TokenExpiredError || (err instanceof Error && err.name === "TokenExpiredError")) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Token has expired");
          }
          if (err instanceof JsonWebTokenError || (err instanceof Error && err.name === "JsonWebTokenError")) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or malformed token");
          }
          if (err instanceof NotBeforeError || (err instanceof Error && err.name === "NotBeforeError")) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Token not active yet");
          }
          throw err;
        }
      }

      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid authentication");
      }

      // Check if user exists and is active
      const isUserExist = await User.findById(user.userId);

      if (!isUserExist) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist");
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
      }

      if (isUserExist.isActive !== IsActive.ACTIVE) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `User account is ${isUserExist.isActive}`
        );
      }

      // Role authorization
      if (authRoles.length > 0 && !authRoles.includes(isUserExist.role as Role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access this resource");
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
