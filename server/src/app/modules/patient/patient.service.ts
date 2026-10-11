import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { Doctor } from '../doctor/doctor.model';
import { IPatient } from './patient.interface';
import { Patient } from './patient.model';
import { patientSearchableFields } from './patient.constant';
import { withTransaction } from '../../utils/withTransaction';

const createPatient = async (payload: IPatient) => {
  return await withTransaction(async (session) => {
    if (payload.doctor) {
      const doctorExists = await Doctor.findById(payload.doctor).session(session || null);
      if (!doctorExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
      }
    }

    const [patient] = await Patient.create([payload], session ? { session } : {});
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
