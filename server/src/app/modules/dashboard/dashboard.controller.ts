import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { Doctor } from '../doctor/doctor.model';
import { Patient } from '../patient/patient.model';
import { sendResponse } from '../../utils/sendResponse';

export const getDashboardAnalytics = catchAsync(async (req: Request, res: Response) => {
  const totalDoctors = await Doctor.countDocuments();
  const totalPatients = await Patient.countDocuments();
  const patientsPerDoctor = await Patient.aggregate([
    { $group: { _id: '$doctor', count: { $sum: 1 } } }
  ]);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard analytics fetched',
    data: {
      totalDoctors,
      totalPatients,
      patientsPerDoctor
    }
  });
});
