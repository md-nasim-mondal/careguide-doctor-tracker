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

const createDoctor = async (payload: IDoctor) => {
  const doctor = await Doctor.create(payload);
  return doctor;
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
