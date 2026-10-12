import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { Doctor } from '../doctor/doctor.model';
import { IPatient } from './patient.interface';
import { Patient } from './patient.model';
import { patientSearchableFields } from './patient.constant';
import { withTransaction } from '../../utils/withTransaction';

import { sendEmail } from '../../utils/sendEmail';

import bcryptjs from 'bcryptjs';
import { User } from '../user/user.model';
import { IsActive, Role } from '../user/user.interface';
import { envVars } from '../../config/env';

const createPatient = async (payload: IPatient) => {
  return await withTransaction(async (session) => {
    let doctorName = "Assigned Specialist";
    if (payload.doctor) {
      const doctorExists = await Doctor.findById(payload.doctor).session(session || null);
      if (!doctorExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
      }
      doctorName = doctorExists.name;
    }

    // Auto-generate or use provided patient email
    let patientEmail = payload.email;
    if (!patientEmail) {
      const cleanName = payload.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'patient';
      patientEmail = `${cleanName}_${Date.now().toString().slice(-4)}@careguide.local`;
      payload.email = patientEmail;
    }

    const [patient] = await Patient.create([payload], session ? { session } : {});

    // Automatically provision a User record with PATIENT role
    const existingUser = await User.findOne({ email: patientEmail }).session(session || null);
    const defaultPassword = "Patient@1234";
    if (!existingUser) {
      const hashedPassword = await bcryptjs.hash(defaultPassword, Number(envVars.BCRYPT_SALT_ROUND) || 10);
      await User.create(
        [
          {
            name: payload.name,
            email: patientEmail,
            phone: payload.phone || "01700000000",
            password: hashedPassword,
            role: Role.PATIENT,
            isActive: IsActive.ACTIVE,
            isVerified: true,
            auths: [{ provider: "credentials", providerId: patientEmail }],
          },
        ],
        session ? { session } : {}
      );
    } else if (existingUser.role !== Role.PATIENT && existingUser.role !== Role.SUPER_ADMIN && existingUser.role !== Role.ADMIN && existingUser.role !== Role.DOCTOR) {
      existingUser.role = Role.PATIENT;
      await existingUser.save(session ? { session } : {});
    }

    // Send notification email (logged/mocked gracefully if SMTP not configured)
    await sendEmail({
      to: patientEmail,
      subject: "DocPulse - Patient Registration Record",
      templateName: "welcomePatient",
      templateData: {
        name: payload.name,
        condition: payload.condition,
        doctorName: doctorName,
      },
    });

    return patient;
  });
};

const getAllPatients = async (query: Record<string, string>) => {
  const queryObj = { ...query };

  // Handle specific date filter if present
  let baseQuery = Patient.find();
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

  // Handle condition filter if present (case-insensitive regex)
  if (queryObj.condition) {
    baseQuery = baseQuery.find({
      condition: { $regex: queryObj.condition, $options: 'i' },
    });
    delete queryObj.condition;
  }

  const patientQuery = new QueryBuilder(baseQuery, queryObj)
    .search(patientSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  patientQuery.modelQuery = patientQuery.modelQuery.populate('doctor');

  const [patients, meta] = await Promise.all([
    patientQuery.build(),
    patientQuery.getMeta(),
  ]);

  return {
    patients,
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
    totalPages: meta.totalPage,
  };
};

const getPatientById = async (id: string) => {
  const patient = await Patient.findById(id).populate('doctor');
  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
  }
  return patient;
};

const updatePatient = async (id: string, payload: Partial<IPatient>) => {
  return await withTransaction(async (session) => {
    const existingPatient = await Patient.findById(id).session(session || null);
    if (!existingPatient) {
      throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
    }

    if (payload.doctor) {
      const doctorExists = await Doctor.findById(payload.doctor).session(session || null);
      if (!doctorExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
      }
    }

    const patient = await Patient.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      ...(session ? { session } : {}),
    });

    return patient;
  });
};

const deletePatient = async (id: string) => {
  return await withTransaction(async (session) => {
    const patient = await Patient.findByIdAndDelete(
      id,
      session ? { session } : {}
    );
    if (!patient) {
      throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
    }

    return null;
  });
};

const getDistinctConditions = async () => {
  const conditions = await Patient.distinct('condition');
  return conditions.filter(Boolean).sort();
};

export const PatientServices = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getDistinctConditions,
};
