import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { Doctor } from './doctor.model';
import { Patient } from '../patient/patient.model';
import AppError from '../../errorHelpers/AppError';
import { sendResponse } from '../../utils/sendResponse';
import { QueryBuilder } from '../../utils/QueryBuilder';

export const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await Doctor.create(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: 'Doctor created', data: doctor });
});

export const getDoctors = catchAsync(async (req: Request, res: Response) => {
  const doctorQuery = new QueryBuilder(
    Doctor.find(),
    req.query as Record<string, string>
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

  sendResponse(res, { 
    statusCode: 200, 
    success: true, 
    message: 'Doctors fetched', 
    data: { 
      doctors, 
      total: meta.total, 
      page: meta.page, 
      limit: meta.limit,
      totalPages: meta.totalPage 
    }
  });
});

export const getDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Doctor fetched', data: doctor });
});

export const getDoctorPatients = catchAsync(async (req: Request, res: Response) => {
  const patients = await Patient.find({ doctor: req.params.id }).populate('doctor');
  sendResponse(res, { statusCode: 200, success: true, message: 'Patients fetched', data: patients });
});

export const addPatientToDoctor = catchAsync(async (req: Request, res: Response) => {
  const patient = await Patient.create({ ...req.body, doctor: req.params.id });
  sendResponse(res, { statusCode: 201, success: true, message: 'Patient added to doctor', data: patient });
});

export const removePatientFromDoctor = catchAsync(async (req: Request, res: Response) => {
  await Patient.findOneAndDelete({ _id: req.params.patientId, doctor: req.params.id });
  sendResponse(res, { statusCode: 200, success: true, message: 'Patient removed from doctor', data: null });
});

export const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const allowedFields = ['name', 'specialization', 'hospital', 'phone', 'email'];
  const updateData: Record<string, any> = {};
  
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }

  sendResponse(res, { statusCode: 200, success: true, message: 'Doctor updated', data: doctor });
});

export const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }

  const patientCount = await Patient.countDocuments({ doctor: req.params.id });
  if (patientCount > 0) {
    throw new AppError(400, `Cannot delete doctor with ${patientCount} associated patient(s). Please reassign or delete these patients first.`);
  }

  await doctor.deleteOne();
  sendResponse(res, { statusCode: 200, success: true, message: 'Doctor deleted', data: null });
});
