import httpStatus from 'http-status-codes';
import  { ClientSession } from 'mongoose';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { Patient } from '../patient/patient.model';
import { IPatient } from '../patient/patient.interface';
import { IDoctor } from './doctor.interface';
import { Doctor } from './doctor.model';
import { doctorAllowedUpdateFields, doctorSearchableFields } from './doctor.constant';
import { withTransaction } from '../../utils/withTransaction';

import bcryptjs from 'bcryptjs';
import { User } from '../user/user.model';
import { IsActive, Role } from '../user/user.interface';
import { sendEmail } from '../../utils/sendEmail';
import { envVars } from '../../config/env';
import { IAuthUser } from '../../interfaces';

const createDoctor = async (payload: IDoctor) => {
  return await withTransaction(async (session) => {
    const doctor = await Doctor.create([payload], session ? { session } : {});
    const createdDoctor = doctor[0];

    // Automatically provision or sync User account with DOCTOR role
    const existingUser = await User.findOne({ email: payload.email }).session(session || null);
    const defaultPassword = "Doctor@1234";

    if (!existingUser) {
      const hashedPassword = await bcryptjs.hash(defaultPassword, Number(envVars.BCRYPT_SALT_ROUND) || 10);
      await User.create(
        [
          {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            password: hashedPassword,
            role: Role.DOCTOR,
            isActive: IsActive.ACTIVE,
            isVerified: true,
            auths: [{ provider: "credentials", providerId: payload.email }],
          },
        ],
        session ? { session } : {}
      );
    } else {
      existingUser.role = Role.DOCTOR;
      existingUser.isActive = IsActive.ACTIVE;
      existingUser.isVerified = true;
      await existingUser.save(session ? { session } : {});
    }

    // Send Welcome Email (graceful mock/notification if SMTP not configured)
    await sendEmail({
      to: payload.email,
      subject: "Welcome to DocPulse - Doctor Account Created",
      templateName: "welcomeDoctor",
      templateData: {
        name: payload.name,
        email: payload.email,
        hospital: payload.hospital,
        tempPassword: existingUser ? undefined : defaultPassword,
      },
    });

    return createdDoctor;
  });
};

const getAllDoctors = async (query: Record<string, string>) => {
  const queryObj = { ...query };

  let baseQuery = Doctor.find();
  if (queryObj.date) {
    const targetDate = new Date(queryObj.date);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);
    baseQuery = baseQuery.find({
      createdAt: {
        $gte: targetDate,
        $lt: nextDay,
      },
    });
    delete queryObj.date;
  }

  // Handle specialization filter if present (case-insensitive regex)
  if (queryObj.specialization && queryObj.specialization.trim()) {
    baseQuery = baseQuery.find({
      specialization: { $regex: queryObj.specialization.trim(), $options: 'i' },
    });
    delete queryObj.specialization;
  }

  const doctorQuery = new QueryBuilder(
    baseQuery,
    queryObj
  )
    .search(doctorSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [doctors, meta] = await Promise.all([
    doctorQuery.build(),
    doctorQuery.getMeta(),
  ]);

  return {
    doctors,
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
    totalPages: meta.totalPage,
  };
};

const getDoctorById = async (id: string) => {
  const doctor = await Doctor.findById(id).lean();
  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  return doctor;
};

const getDoctorPatients = async (doctorId: string, authUser?: IAuthUser) => {
  if (authUser?.role === Role.PATIENT) {
    throw new AppError(httpStatus.FORBIDDEN, 'Patients cannot view other patients assigned records');
  }

  if (authUser?.role === Role.DOCTOR) {
    const doctor = await Doctor.findOne({ email: authUser.email }).select('_id').lean();
    if (!doctor || doctor._id.toString() !== doctorId) {
      throw new AppError(httpStatus.FORBIDDEN, 'Doctors can only access their own assigned patient roster');
    }
  }

  const patients = await Patient.find({ doctor: doctorId }).populate('doctor').lean();
  return patients;
};

const addPatientToDoctor = async (doctorId: string, payload: Partial<IPatient>) => {
  return await withTransaction(async (session: ClientSession | undefined) => {
    const doctor = await Doctor.findById(doctorId).session(session || null);
    if (!doctor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const [patient] = await Patient.create(
      [{ ...payload, doctor: doctorId }],
      session ? { session } : {}
    );
    return patient;
  });
};

const removePatientFromDoctor = async (doctorId: string, patientId: string) => {
  return await withTransaction(async (session: ClientSession | undefined) => {
    const doctor = await Doctor.findById(doctorId).session(session || null);
    if (!doctor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const patient = await Patient.findOneAndDelete(
      { _id: patientId, doctor: doctorId },
      session ? { session } : {}
    );
    if (!patient) {
      throw new AppError(httpStatus.NOT_FOUND, 'Patient not found for this doctor');
    }

    return patient;
  });
};

const updateDoctor = async (id: string, payload: Partial<IDoctor>) => {
  const updateData: Partial<IDoctor> = {};

  for (const field of doctorAllowedUpdateFields) {
    if (payload[field] !== undefined) {
      updateData[field] = payload[field];
    }
  }

  const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  return doctor;
};

const deleteDoctor = async (id: string) => {
  return await withTransaction(async (session: ClientSession | undefined) => {
    const doctor = await Doctor.findById(id).session(session || null);
    if (!doctor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const patientCount = await Patient.countDocuments({ doctor: id }).session(session || null);
    if (patientCount > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot delete doctor with ${patientCount} associated patient(s). Please reassign or delete these patients first.`
      );
    }

    await doctor.deleteOne(session ? { session } : {});
    return null;
  });
};

export const DoctorServices = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorPatients,
  addPatientToDoctor,
  removePatientFromDoctor,
  updateDoctor,
  deleteDoctor,
};
