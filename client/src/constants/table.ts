export const DOCTOR_TABLE_HEADERS = {
  NAME: "Name",
  SPECIALIZATION: "Specialization",
  HOSPITAL: "Hospital",
  ACTIONS: "Actions",
} as const;

export const PATIENT_TABLE_HEADERS = {
  NAME: "Name",
  AGE: "Age",
  CONDITION: "Condition",
  DOCTOR: "Doctor",
  DATE: "Date",
  ACTIONS: "Actions",
} as const;

export type DoctorTableHeader =
  (typeof DOCTOR_TABLE_HEADERS)[keyof typeof DOCTOR_TABLE_HEADERS];

export type PatientTableHeader =
  (typeof PATIENT_TABLE_HEADERS)[keyof typeof PATIENT_TABLE_HEADERS];
