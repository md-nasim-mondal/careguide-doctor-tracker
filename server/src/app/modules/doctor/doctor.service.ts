import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { Patient } from '../patient/patient.model';
import { IPatient } from '../patient/patient.interface';
import { IDoctor } from './doctor.interface';
import { Doctor } from './doctor.model';

const createDoctor = async (payload: IDoctor) => {
  const doctor = await Doctor.create(payload);
  return doctor;
};

const getAllDoctors = async (query: Record<string, string>) => {
  const doctorQuery = new QueryBuilder(
    Doctor.find(),
    query
  )
    .search(['name', 'specialization'])
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
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  return doctor;
};

const getDoctorPatients = async (doctorId: string) => {
  const patients = await Patient.find({ doctor: doctorId }).populate('doctor');
  return patients;
};

const addPatientToDoctor = async (doctorId: string, payload: Partial<IPatient>) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const doctor = await Doctor.findById(doctorId).session(session);
    if (!doctor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const [patient] = await Patient.create([{ ...payload, doctor: doctorId }], { session });

    await session.commitTransaction();
    return patient;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const removePatientFromDoctor = async (doctorId: string, patientId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const doctor = await Doctor.findById(doctorId).session(session);
    if (!doctor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const patient = await Patient.findOneAndDelete(
      { _id: patientId, doctor: doctorId },
      { session }
    );
    if (!patient) {
      throw new AppError(httpStatus.NOT_FOUND, 'Patient not found for this doctor');
    }

    await session.commitTransaction();
    return patient;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const updateDoctor = async (id: string, payload: Partial<IDoctor>) => {
  const allowedFields: (keyof IDoctor)[] = ['name', 'specialization', 'hospital', 'phone', 'email'];
  const updateData: Partial<IDoctor> = {};

  for (const field of allowedFields) {
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
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const doctor = await Doctor.findById(id).session(session);
    if (!doctor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const patientCount = await Patient.countDocuments({ doctor: id }).session(session);
    if (patientCount > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot delete doctor with ${patientCount} associated patient(s). Please reassign or delete these patients first.`
      );
    }

    await doctor.deleteOne({ session });

    await session.commitTransaction();
    return null;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
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
