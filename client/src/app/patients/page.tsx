import { fetchServerApi } from "@/lib/serverApi";
import { PatientClientShell } from "@/components/patients/PatientClientShell";

export const instant = false;

type PageProps = {
  searchParams: Promise<{ page?: string; search?: string; condition?: string; date?: string }>;
};

export default async function PatientsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const search = resolvedSearchParams.search || "";
  const condition = resolvedSearchParams.condition || "";
  const date = resolvedSearchParams.date || "";
  const limit = 10;

  let initialPatients = [];
  let doctorsList = [];
  let totalPages = 1;
  let error = "";

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
      fetchServerApi(`/doctors?limit=1000`) // fetch a large limit of doctors for the dropdown
    ]);

    initialPatients = patientsRes.data?.patients || [];
    totalPages = Math.ceil((patientsRes.data?.total || 0) / limit) || 1;
    doctorsList = doctorsRes.data?.doctors || [];
  } catch (err: unknown) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = "An unknown error occurred.";
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-foreground bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Patient Management</h1>
      
      {error && <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded shadow-sm">{error}</div>}

      <PatientClientShell 
        initialPatients={initialPatients} 
        doctors={doctorsList}
        totalPages={totalPages} 
        currentPage={page} 
        currentSearch={search}
        currentCondition={condition}
        currentDate={date}
      />
    </div>
  );
}
