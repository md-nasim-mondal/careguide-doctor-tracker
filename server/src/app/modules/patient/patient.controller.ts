import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { Patient } from './patient.model';
import { Doctor } from '../doctor/doctor.model';
import AppError from '../../errorHelpers/AppError';
import { sendResponse } from '../../utils/sendResponse';
import { QueryBuilder } from '../../utils/QueryBuilder';

export const createPatient = catchAsync(async (req: Request, res: Response) => {
  if (req.body.doctor) {
    const doctorExists = await Doctor.findById(req.body.doctor);
    if (!doctorExists) {
      throw new AppError(404, 'Doctor not found');
    }
  }
  const patient = await Patient.create(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: 'Patient created', data: patient });
});

export const getPatients = catchAsync(async (req: Request, res: Response) => {
  const queryObj = { ...(req.query as Record<string, string>) };

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

  const patientQuery = new QueryBuilder(
    baseQuery,
    queryObj
  )
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

  sendResponse(res, { 
    statusCode: 200, 
    success: true, 
    message: 'Patients fetched', 
    data: { 
      patients, 
      total: meta.total, 
      page: meta.page, 
      limit: meta.limit,
      totalPages: meta.totalPage 
    }
  });
});

export const updatePatient = catchAsync(async (req: Request, res: Response) => {
  if (req.body.doctor) {
    const doctorExists = await Doctor.findById(req.body.doctor);
    if (!doctorExists) {
      throw new AppError(404, 'Doctor not found');
    }
  }
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!patient) {
    throw new AppError(404, 'Patient not found');
  }
  sendResponse(res, { statusCode: 200, success: true, message: 'Patient updated', data: patient });
});

export const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);
  if (!patient) {
    throw new AppError(404, 'Patient not found');
  }
  sendResponse(res, { statusCode: 200, success: true, message: 'Patient deleted', data: null });
});
