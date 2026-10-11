import { fetchServerApi } from "@/lib/serverApi";
import AlertBanner from "@/components/common/AlertBanner";
import DoctorSearchBar from "@/components/doctors/DoctorSearchBar";
import DoctorForm from "@/components/doctors/DoctorForm";
import DoctorsTable from "@/components/doctors/DoctorsTable";
import DoctorDetailsPanel from "@/components/doctors/DoctorDetailsPanel";
import type { DoctorItem, DoctorPageSearchParams, PatientItem } from "@/types";

export const instant = false;

type PageProps = {
  searchParams: Promise<DoctorPageSearchParams>;
};

export default async function DoctorsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const search = resolvedSearchParams.search || "";
  const specialization = resolvedSearchParams.specialization || "";
  const date = resolvedSearchParams.date || "";
  const doctorId = resolvedSearchParams.doctorId || "";
  const action = resolvedSearchParams.action || "";
  const errorQuery = resolvedSearchParams.error || "";
  const limit = 10;

  let initialDoctors: DoctorItem[] = [];
  let totalPages = 1;
  let fetchError = "";

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) queryParams.set("search", search);
    if (specialization) queryParams.set("specialization", specialization);
    if (date) queryParams.set("date", date);

    const res = await fetchServerApi(`/doctors?${queryParams.toString()}`);
    initialDoctors = res.data?.doctors || [];
    totalPages = Math.ceil((res.data?.total || 0) / limit) || 1;
  } catch (err: unknown) {
    if (err instanceof Error) {
      fetchError = err.message;
    } else {
      fetchError = "An unknown error occurred.";
    }
  }

  const errorMessage = errorQuery || fetchError;
  const showAddForm = action === "add";
  const isEditing = action === "edit";
  const isAddingPatient = action === "add-patient";

  // Find selected doctor from current page or fetch if selected from another view
  let selectedDoctor = initialDoctors.find((d) => d._id === doctorId) || null;
  if (!selectedDoctor && doctorId) {
    try {
      const singleRes = await fetchServerApi(`/doctors/${doctorId}`);
      selectedDoctor = singleRes.data || null;
    } catch {
      selectedDoctor = null;
    }
  }

  // Fetch corresponding patients for the selected doctor
  let assignedPatients: PatientItem[] = [];
  if (selectedDoctor) {
    try {
      const patientsRes = await fetchServerApi(`/doctors/${selectedDoctor._id}/patients`);
      assignedPatients = patientsRes.data || [];
    } catch {
      assignedPatients = [];
    }
  }

  const buildQuery = (params: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (specialization) sp.set("specialization", specialization);
    if (date) sp.set("date", date);
    if (page > 1) sp.set("page", page.toString());
    Object.entries(params).forEach(([key, val]) => {
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
    <div className="p-2.5 sm:p-6 md:p-8 max-w-6xl mx-auto text-foreground bg-background min-h-screen">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-foreground">Doctor Management</h1>

      {errorMessage && (
        <div className="mb-4">
          <AlertBanner variant="error" message={errorMessage} />
        </div>
      )}

      {/* Search and Action Bar */}
      <DoctorSearchBar
        search={search}
        specialization={specialization}
        date={date}
        showAddForm={showAddForm}
        buildQuery={buildQuery}
      />

      {/* Add Doctor Form */}
      {showAddForm && <DoctorForm buildQuery={buildQuery} />}

      {/* Main Grid: Doctors Table + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DoctorsTable
          doctors={initialDoctors}
          currentPage={page}
          totalPages={totalPages}
          buildQuery={buildQuery}
        />

        <DoctorDetailsPanel
          selectedDoctor={selectedDoctor}
          assignedPatients={assignedPatients}
          isEditing={isEditing}
          isAddingPatient={isAddingPatient}
          buildQuery={buildQuery}
        />
      </div>
    </div>
  );
}
