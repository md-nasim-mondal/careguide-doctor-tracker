import { Types } from 'mongoose';

export interface IPatientPerDoctor {
  _id: Types.ObjectId;
  count: number;
  doctorName: string;
}

export interface IRegistrationOverTime {
  _id: string; // date string 'YYYY-MM-DD'
  count: number;
}

export interface IDashboardAnalytics {
  totalDoctors: number;
  totalPatients: number;
  patientsPerDoctor: IPatientPerDoctor[];
  registrationsOverTime: IRegistrationOverTime[];
}
