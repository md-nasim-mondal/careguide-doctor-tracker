import { fetchServerApi } from "@/lib/serverApi";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AlertBanner from "@/components/common/AlertBanner";
import PatientFilterBar from "@/components/patients/PatientFilterBar";
import PatientForm from "@/components/patients/PatientForm";
import PatientsTable from "@/components/patients/PatientsTable";
import type {
  DoctorOption,
  DoctorListResponse,
  PatientFormModel,
  PatientItem,
  PatientListResponse,
  PatientPageSearchParams,
} from "@/types";

export const instant = false;

type PageProps = {
  searchParams: Promise<PatientPageSearchParams>;
};

export default async function PatientsPage({ searchParams }: PageProps) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role === "PATIENT") {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const search = resolvedSearchParams.search || "";
  const condition = resolvedSearchParams.condition || "";
  const date = resolvedSearchParams.date || "";
  const action = resolvedSearchParams.action || "";
  const patientId = resolvedSearchParams.patientId || "";
  const errorQuery = resolvedSearchParams.error || "";
  const limit = 10;

  let initialPatients: PatientItem[] = [];
  let doctorsList: DoctorOption[] = [];
  let conditionsList: string[] = [];
  let totalPages = 1;
  let fetchError = "";

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(condition && { condition }),
      ...(date && { date }),
    });

    const [patientsRes, doctorsRes, conditionsRes] = await Promise.all([
      fetchServerApi<PatientListResponse>(`/patients?${params.toString()}`),
      fetchServerApi<DoctorListResponse>("/doctors?limit=100"),
      fetchServerApi<string[]>("/patients/conditions").catch(() => ({ data: [] as string[] })),
    ]);

    initialPatients = patientsRes.data?.patients || [];
    doctorsList = doctorsRes.data?.doctors || [];
    conditionsList = conditionsRes.data || [];
    totalPages = Math.ceil((patientsRes.data?.total || 0) / limit) || 1;
  } catch (err: unknown) {
    if (err instanceof Error) {
      fetchError = err.message;
    } else {
      fetchError = "An unknown error occurred.";
    }
  }

  const errorMessage = errorQuery || fetchError;
  const showAddForm = action === "add";
  const isEditing = action === "edit" && Boolean(patientId);

  let editingPatient: PatientFormModel | null = initialPatients.find((p) => p._id === patientId) || null;
  if (!editingPatient && patientId && isEditing) {
    try {
      const singlePatientRes = await fetchServerApi<PatientFormModel>(`/patients/${patientId}`);
      editingPatient = singlePatientRes.data || null;
    } catch {
      editingPatient = null;
    }
  }

  const buildQuery = (newParams: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (condition) sp.set("condition", condition);
    if (date) sp.set("date", date);
    if (page > 1) sp.set("page", page.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        sp.set(key, val.toString());
      } else {
        sp.delete(key);
      }
    });
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  };

  const isDoctor = currentUser?.role === "DOCTOR";
  const canManage = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
  const currentDoctorId = isDoctor
    ? doctorsList.find(
        (d) =>
          d.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
          d.name.toLowerCase() === currentUser?.name?.toLowerCase()
      )?._id || ""
    : "";

  let editingDoctorId = "";
  if (editingPatient?.doctor) {
    editingDoctorId =
      typeof editingPatient.doctor === "object"
        ? editingPatient.doctor._id
        : (editingPatient.doctor as string);
  }
  const isAllowedToEdit = canManage || (isDoctor && currentDoctorId && editingDoctorId === currentDoctorId);

  return (
    <div className="w-full space-y-6 text-foreground">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-foreground">
          {isDoctor ? "Patient Care & Clinical Records" : "Patient Management"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {isDoctor
            ? "Review patient records, update clinical notes for your assigned patients, or register new patients under your care."
            : "Register, modify doctor assignments, and manage patient profiles across the clinic."}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4">
          <AlertBanner variant="error" message={errorMessage} />
        </div>
      )}

      {isEditing && editingPatient && !isAllowedToEdit && (
        <div className="mb-4">
          <AlertBanner
            variant="error"
            message="Access Denied: Doctors are only permitted to update clinical notes for their own assigned patients."
          />
        </div>
      )}

      {/* URL Filter Bar */}
      <PatientFilterBar
        search={search}
        condition={condition}
        date={date}
        conditionsList={conditionsList}
        showAddForm={showAddForm}
        buildQuery={buildQuery}
      />

      {/* Add Patient Form */}
      {showAddForm && (
        <PatientForm
          doctorsList={doctorsList}
          isDoctor={isDoctor}
          currentDoctorId={currentDoctorId}
          buildQuery={buildQuery}
        />
      )}

      {/* Edit Patient Form (Allowed if Admin or Doctor's Own Patient) */}
      {isEditing && editingPatient && isAllowedToEdit && (
        <PatientForm
          patient={editingPatient}
          doctorsList={doctorsList}
          isEditing={true}
          isDoctor={isDoctor}
          currentDoctorId={currentDoctorId}
          buildQuery={buildQuery}
        />
      )}

      {/* Patients Table */}
      <PatientsTable
        patients={initialPatients}
        currentPage={page}
        totalPages={totalPages}
        canManage={canManage}
        isDoctor={isDoctor}
        currentDoctorId={currentDoctorId}
        buildQuery={buildQuery}
      />
    </div>
  );
}

