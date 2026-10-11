export interface PatientPerDoctor {
  _id: string;
  count: number;
  doctorName: string;
}

export interface RegistrationData {
  _id: string; // date string YYYY-MM-DD
  count: number;
}

export interface DashboardAnalytics {
  totalDoctors: number;
  totalPatients: number;
  patientsPerDoctor: PatientPerDoctor[];
  registrationsOverTime: RegistrationData[];
}

export interface DashboardChartsProps {
  patientsPerDoctor: PatientPerDoctor[];
  registrationsOverTime: RegistrationData[];
}
