import { Doctor } from '../doctor/doctor.model';
import { Patient } from '../patient/patient.model';
import { IDashboardAnalytics, IPatientPerDoctor, IRegistrationOverTime } from './dashboard.interface';

const getDashboardAnalytics = async (): Promise<IDashboardAnalytics> => {
  const [totalDoctors, totalPatients] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
  ]);

  // Aggregate patients per doctor and lookup doctor name
  const patientsPerDoctor = await Patient.aggregate<IPatientPerDoctor>([
    { $group: { _id: '$doctor', count: { $sum: 1 } } },
    { $lookup: { from: 'doctors', localField: '_id', foreignField: '_id', as: 'doctorDetails' } },
    { $unwind: '$doctorDetails' },
    { $project: { _id: 1, count: 1, doctorName: '$doctorDetails.name' } },
  ]);

  // Aggregate patients over time grouped by YYYY-MM-DD
  const registrationsOverTime = await Patient.aggregate<IRegistrationOverTime>([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    totalDoctors,
    totalPatients,
    patientsPerDoctor,
    registrationsOverTime,
  };
};

export const DashboardServices = {
  getDashboardAnalytics,
};
