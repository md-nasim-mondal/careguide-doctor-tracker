import { fetchServerApi } from "@/lib/serverApi";
import { DoctorClientShell } from "@/components/doctors/DoctorClientShell";

export const instant = false;

type PageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function DoctorsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const search = resolvedSearchParams.search || "";
  const limit = 10;

  let initialDoctors = [];
  let totalPages = 1;
  let error = "";

  try {
    const res = await fetchServerApi(`/doctors?page=${page}&limit=${limit}&search=${search}`);
    initialDoctors = res.data?.doctors || [];
    totalPages = Math.ceil((res.data?.total || 0) / limit) || 1;
  } catch (err: unknown) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = "An unknown error occurred.";
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-foreground bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Doctor Management</h1>
      
      {error && <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded shadow-sm">{error}</div>}

      <DoctorClientShell 
        initialDoctors={initialDoctors} 
        totalPages={totalPages} 
        currentPage={page} 
        currentSearch={search} 
      />
    </div>
  );
}
