import type { PatientItem } from "./patient";

export interface DoctorItem {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

export type DoctorOption = Pick<DoctorItem, "_id" | "name"> & {
  email?: string;
  specialization?: string;
};

export interface DoctorSearchBarProps {
  search: string;
  specialization: string;
  date: string;
  showAddForm: boolean;
  canManage?: boolean;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export interface DoctorFormProps {
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export interface DoctorsTableProps {
  doctors: DoctorItem[];
  currentPage: number;
  totalPages: number;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export interface DoctorDetailsPanelProps {
  selectedDoctor: DoctorItem | null;
  assignedPatients: PatientItem[];
  isEditing: boolean;
  isAddingPatient?: boolean;
  canManage?: boolean;
  isPatient?: boolean;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export type DoctorPageSearchParams = {
  page?: string;
  search?: string;
  specialization?: string;
  date?: string;
  doctorId?: string;
  action?: string;
  error?: string;
};
