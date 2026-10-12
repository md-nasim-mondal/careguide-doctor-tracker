import type { DoctorOption } from "./doctor";

export interface PatientItem {
  _id: string;
  name: string;
  age: number;
  condition: string;
  doctor: DoctorOption | string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface PatientListResponse {
  patients: PatientItem[];
  total: number;
}

export interface PatientFormModel {
  _id?: string;
  name?: string;
  age?: number;
  condition?: string;
  doctor?: DoctorOption | string;
  email?: string;
  phone?: string;
}

export interface PatientFilterBarProps {
  search: string;
  condition: string;
  date: string;
  conditionsList?: string[];
  showAddForm: boolean;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export interface PatientFormProps {
  patient?: PatientFormModel | null;
  doctorsList: DoctorOption[];
  isEditing?: boolean;
  isDoctor?: boolean;
  currentDoctorId?: string;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export interface PatientsTableProps {
  patients: PatientItem[];
  currentPage: number;
  totalPages: number;
  canManage?: boolean;
  canDelete?: boolean;
  isDoctor?: boolean;
  currentDoctorId?: string;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export type PatientPageSearchParams = {
  page?: string;
  search?: string;
  condition?: string;
  date?: string;
  action?: string;
  patientId?: string;
  error?: string;
};
