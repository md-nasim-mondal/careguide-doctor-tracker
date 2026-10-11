export interface DoctorItem {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

export type DoctorOption = Pick<DoctorItem, "_id" | "name">;

export interface DoctorSearchBarProps {
  search: string;
  showAddForm: boolean;
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
  isEditing: boolean;
  buildQuery: (params: Record<string, string | number | undefined>) => string;
}

export type DoctorPageSearchParams = {
  page?: string;
  search?: string;
  doctorId?: string;
  action?: string;
  error?: string;
};
