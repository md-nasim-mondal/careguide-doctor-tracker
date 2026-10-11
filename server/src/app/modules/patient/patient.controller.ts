import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { Patient } from './patient.model';
import { Doctor } from '../doctor/doctor.model';
import AppError from '../../errorHelpers/AppError';
import { sendResponse } from '../../utils/sendResponse';

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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  let query: any = {};
  
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  if (req.query.condition) {
    query.condition = { $regex: req.query.condition, $options: 'i' };
  }

  if (req.query.date) {
    const targetDate = new Date(req.query.date as string);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);
    query.createdAt = {
      $gte: targetDate,
      $lt: nextDay
    };
  }

  const total = await Patient.countDocuments(query);
  const patients = await Patient.find(query).populate('doctor').skip(skip).limit(limit).sort({ createdAt: -1 });

  sendResponse(res, { 
    statusCode: 200, 
    success: true, 
    message: 'Patients fetched', 
    data: { patients, total, page, limit }
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
