import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { Doctor } from '../doctor/doctor.model';
import { IPatient } from './patient.interface';
import { Patient } from './patient.model';

const createPatient = async (payload: IPatient) => {
  if (payload.doctor) {
    const doctorExists = await Doctor.findById(payload.doctor);
    if (!doctorExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }
  }
  const patient = await Patient.create(payload);
  return patient;
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
    .search(['name', 'condition'])
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
  if (payload.doctor) {
    const doctorExists = await Doctor.findById(payload.doctor);
    if (!doctorExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }
  }

  const patient = await Patient.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
  }

  return patient;
};

const deletePatient = async (id: string) => {
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
  }
  return null;
};

export const PatientServices = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
