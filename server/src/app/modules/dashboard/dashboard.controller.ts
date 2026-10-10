import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { Doctor } from '../doctor/doctor.model';
import { Patient } from '../patient/patient.model';
import { sendResponse } from '../../utils/sendResponse';

export const getDashboardAnalytics = catchAsync(async (req: Request, res: Response) => {
  const totalDoctors = await Doctor.countDocuments();
  const totalPatients = await Patient.countDocuments();
  
  // Aggregate patients per doctor and lookup doctor name
  const patientsPerDoctor = await Patient.aggregate([
    { $group: { _id: '$doctor', count: { $sum: 1 } } },
    { $lookup: { from: 'doctors', localField: '_id', foreignField: '_id', as: 'doctorDetails' } },
    { $unwind: '$doctorDetails' },
    { $project: { _id: 1, count: 1, doctorName: '$doctorDetails.name' } }
  ]);

  // Aggregate patients over time (e.g., grouped by month/year or just by day if using createdAt)
  // We'll group by YYYY-MM-DD
  const registrationsOverTime = await Patient.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard analytics fetched',
    data: {
      totalDoctors,
      totalPatients,
      patientsPerDoctor,
      registrationsOverTime
    }
  });
});
