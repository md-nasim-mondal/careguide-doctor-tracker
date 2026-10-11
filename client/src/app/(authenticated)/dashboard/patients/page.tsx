import { fetchServerApi } from "@/lib/serverApi";
import AlertBanner from "@/components/common/AlertBanner";
import PatientFilterBar from "@/components/patients/PatientFilterBar";
import PatientForm from "@/components/patients/PatientForm";
import PatientsTable from "@/components/patients/PatientsTable";
import type {
  DoctorOption,
  PatientFormModel,
  PatientItem,
  PatientPageSearchParams,
} from "@/types";

export const instant = false;

type PageProps = {
  searchParams: Promise<PatientPageSearchParams>;
};

export default async function PatientsPage({ searchParams }: PageProps) {
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

    const [patientsRes, doctorsRes] = await Promise.all([
      fetchServerApi(`/patients?${params.toString()}`),
      fetchServerApi("/doctors?limit=100"),
    ]);

    initialPatients = patientsRes.data?.patients || [];
    doctorsList = doctorsRes.data?.doctors || [];
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
      const singlePatientRes = await fetchServerApi(`/patients/${patientId}`);
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

  return (
    <div className="p-8 max-w-6xl mx-auto text-foreground bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Patient Management</h1>

      {errorMessage && (
        <div className="mb-4">
          <AlertBanner variant="error" message={errorMessage} />
        </div>
      )}

      {/* URL Filter Bar */}
      <PatientFilterBar
        search={search}
        condition={condition}
        date={date}
        showAddForm={showAddForm}
        buildQuery={buildQuery}
      />

      {/* Add Patient Form */}
      {showAddForm && (
        <PatientForm
          doctorsList={doctorsList}
          buildQuery={buildQuery}
        />
      )}

      {/* Edit Patient Form */}
      {isEditing && editingPatient && (
        <PatientForm
          patient={editingPatient}
          doctorsList={doctorsList}
          isEditing={true}
          buildQuery={buildQuery}
        />
      )}

      {/* Patients Table */}
      <PatientsTable
        patients={initialPatients}
        currentPage={page}
        totalPages={totalPages}
        buildQuery={buildQuery}
      />
    </div>
  );
}

