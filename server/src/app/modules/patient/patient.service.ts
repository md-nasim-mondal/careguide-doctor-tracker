import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { Doctor } from '../doctor/doctor.model';
import { IPatient } from './patient.interface';
import { Patient } from './patient.model';
import { patientSearchableFields } from './patient.constant';

const createPatient = async (payload: IPatient) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (payload.doctor) {
      const doctorExists = await Doctor.findById(payload.doctor).session(session);
      if (!doctorExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
      }
    }

    const [patient] = await Patient.create([payload], { session });

    await session.commitTransaction();
    return patient;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
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
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const existingPatient = await Patient.findById(id).session(session);
    if (!existingPatient) {
      throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
    }

    if (payload.doctor) {
      const doctorExists = await Doctor.findById(payload.doctor).session(session);
      if (!doctorExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
      }
    }

    const patient = await Patient.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    return patient;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const deletePatient = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const patient = await Patient.findByIdAndDelete(id, { session });
    if (!patient) {
      throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
    }

    await session.commitTransaction();
    return null;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const PatientServices = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
