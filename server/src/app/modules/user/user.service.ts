import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, IsActive, Role } from "./user.interface";
import { User } from "./user.model";
import { Doctor } from "../doctor/doctor.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { sendEmail } from "../../utils/sendEmail";
import { ms } from "../../utils/ms";

import { withTransaction } from "../../utils/withTransaction";

const createUser = async (payload: Partial<IUser> & { specialization?: string; hospital?: string }) => {
  const { email, password, specialization, hospital, role: reqRole, ...rest } = payload;

  const role = reqRole || Role.RECEIVER; // Default new registrations to RECEIVER (Patient)
  const isDoctorRegistration = role === Role.SENDER;

  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const verificationCodeExpires = new Date(Date.now() + ms(envVars.OTP_EXPIRES));

  const user = await withTransaction(async (session) => {
    const isUserExist = await User.findOne({ email }).session(session || null);

    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
    }

    const hashedPassword = await bcryptjs.hash(
      password as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: email as string,
    };

    // If registering as Doctor (SENDER), default to INACTIVE pending admin approval
    // If registering as Patient (RECEIVER), activate immediately
    const initialStatus = isDoctorRegistration ? IsActive.INACTIVE : IsActive.ACTIVE;

    const [newUser] = await User.create(
      [
        {
          email,
          password: hashedPassword,
          auths: [authProvider],
          verificationCode,
          verificationCodeExpires,
          role,
          isActive: initialStatus,
          isVerified: !isDoctorRegistration,
          ...rest,
        },
      ],
      session ? { session } : {}
    );

    // If Doctor registered, also link/create Doctor profile if specialization & hospital provided
    if (isDoctorRegistration) {
      try {
        const existingDoc = await Doctor.findOne({ email }).session(session || null);
        if (!existingDoc) {
          await Doctor.create(
            [
              {
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone || "+8801700000000",
                specialization: specialization || "General Medicine",
                hospital: hospital || "DocPulse Medical Center",
              },
            ],
            session ? { session } : {}
          );
        } else {
          // If Doctor already exists with this email, update details
          existingDoc.name = newUser.name;
          if (newUser.phone) existingDoc.phone = newUser.phone;
          if (specialization) existingDoc.specialization = specialization;
          if (hospital) existingDoc.hospital = hospital;
          await existingDoc.save({ session });
        }
      } catch (docErr) {
        console.warn("Notice: Doctor profile linking skipped/already exists:", docErr);
      }
    }

    return newUser;
  });

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    templateName: "verifyEmail",
    templateData: {
      name: user.name,
      code: verificationCode,
    },
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (
    decodedToken.role === Role.SENDER ||
    decodedToken.role === Role.RECEIVER
  ) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, "You are not authorized!");
    }
  }

  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (
    decodedToken.role === Role.ADMIN &&
    ifUserExist.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(401, "You are not authorized!");
  }

  /**
   * email - can not update
   * name, phone, password address
   * password - re hashing
   *  only admin superadmin - role, isDeleted...
   *
   * promoting to superadmin - superadmin
   */

  if (payload.role) {
    if (
      decodedToken.role === Role.SENDER ||
      decodedToken.role === Role.RECEIVER
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    // if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
    //     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    // }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (
      decodedToken.role === Role.SENDER ||
      decodedToken.role === Role.RECEIVER
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  if (newUpdatedUser && payload.role === Role.SENDER) {
    const docExists = await Doctor.findOne({ email: newUpdatedUser.email });
    if (!docExists) {
      await Doctor.create({
        name: newUpdatedUser.name,
        email: newUpdatedUser.email,
        phone: newUpdatedUser.phone || "+8801700000000",
        specialization: "General Medicine",
        hospital: "DocPulse Medical Center",
      });
    }
  }

  return newUpdatedUser;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const usersData = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

const verifyEmail = async (email: string, code: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already verified");
  }

  if (user.verificationCode !== code) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid verification code");
  }

  if (
    user.verificationCodeExpires &&
    new Date() > user.verificationCodeExpires
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Verification code expired");
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  return user;
};

const deleteUser = async (userId: string, decodedToken: JwtPayload) => {
  if (
    decodedToken.role !== Role.SUPER_ADMIN &&
    decodedToken.role !== Role.ADMIN
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to delete users");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === Role.SUPER_ADMIN && decodedToken.role !== Role.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Only a Super Admin can delete another Super Admin");
  }

  // Also remove linked doctor profile if user was a doctor
  if (user.role === Role.SENDER) {
    await Doctor.findOneAndDelete({ email: user.email });
  }

  await User.findByIdAndDelete(userId);
  return null;
};

const approveDoctorUser = async (userId: string, decodedToken: JwtPayload) => {
  if (
    decodedToken.role !== Role.SUPER_ADMIN &&
    decodedToken.role !== Role.ADMIN
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to approve doctors");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  user.isActive = IsActive.ACTIVE;
  user.isVerified = true;
  await user.save();

  // If Doctor profile record doesn't exist yet, ensure it is created
  if (user.role === Role.SENDER) {
    const doctorExists = await Doctor.findOne({ email: user.email });
    if (!doctorExists) {
      await Doctor.create({
        name: user.name,
        email: user.email,
        phone: user.phone || "+8801700000000",
        specialization: "General Medicine",
        hospital: "DocPulse Medical Center",
      });
    }
  }

  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
  getMe,
  verifyEmail,
  deleteUser,
  approveDoctorUser,
};
