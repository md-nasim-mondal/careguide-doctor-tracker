import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JsonWebTokenError, JwtPayload, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      let accessToken = req.headers.authorization;

      if (!accessToken && req.cookies?.accessToken) {
        accessToken = req.cookies.accessToken;
      }

      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
      }

      if (accessToken.startsWith("Bearer ")) {
        accessToken = accessToken.slice(7).trim();
      }

      let user: JwtPayload;

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

      if (!user || !user.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid authentication");
      }

      const isUserExist = await User.findById(user.userId)
        .select("_id email role name isActive isDeleted")
        .lean();

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

      if (authRoles.length > 0 && !authRoles.includes(isUserExist.role as Role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access this resource");
      }

      req.user = {
        userId: isUserExist._id.toString(),
        email: isUserExist.email,
        role: isUserExist.role as Role,
        name: isUserExist.name,
        isActive: isUserExist.isActive,
        isDeleted: isUserExist.isDeleted,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
