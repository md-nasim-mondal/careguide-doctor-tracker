import { fetchServerApi } from "@/lib/serverApi";
import { createPatientAction, updatePatientAction, deletePatientAction } from "@/actions/patients";
import Link from "next/link";

export const instant = false;

type Doctor = { _id: string; name: string };
type Patient = {
  _id: string;
  name: string;
  age: number;
  condition: string;
  doctor: Doctor | string;
  createdAt: string;
};

type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    condition?: string;
    date?: string;
    action?: string;
    patientId?: string;
    error?: string;
  }>;
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

  let initialPatients: Patient[] = [];
  let doctorsList: Doctor[] = [];
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

  let editingPatient = initialPatients.find((p) => p._id === patientId) || null;
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
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded shadow-sm border border-destructive/20">
          {errorMessage}
        </div>
      )}

      {/* URL Filter Form */}
      <form method="GET" action="/dashboard/patients" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          name="search"
          placeholder="Search patients..."
          defaultValue={search}
          className="p-2 border border-input rounded bg-card text-foreground"
        />
        <input
          name="condition"
          placeholder="Filter condition..."
          defaultValue={condition}
          className="p-2 border border-input rounded bg-card text-foreground"
        />
        <input
          type="date"
          name="date"
          defaultValue={date}
          className="p-2 border border-input rounded bg-card text-foreground"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 font-medium text-sm"
          >
            Filter
          </button>
          <Link
            href="/dashboard/patients"
            className="px-4 py-2 bg-muted text-foreground border border-border rounded hover:bg-muted/80 flex items-center justify-center text-sm font-medium"
          >
            Reset
          </Link>
        </div>
      </form>

      {/* Action Bar */}
      <div className="flex justify-end mb-4">
        {showAddForm ? (
          <Link
            href={`/dashboard/patients${buildQuery({ action: undefined })}`}
            className="px-4 py-2 bg-muted text-foreground border border-border rounded text-sm font-medium"
          >
            Cancel
          </Link>
        ) : (
          <Link
            href={`/dashboard/patients${buildQuery({ action: "add", patientId: undefined })}`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 text-sm font-medium"
          >
            Add Patient
          </Link>
        )}
      </div>

      {/* Add Patient Form */}
      {showAddForm && (
        <form
          action={createPatientAction}
          className="bg-card p-6 border border-border rounded mb-6 grid grid-cols-2 gap-4 text-foreground shadow-sm"
        >
          <input
            name="name"
            className="p-2 border border-input rounded bg-background"
            placeholder="Full Name"
            required
          />
          <input
            name="age"
            type="number"
            className="p-2 border border-input rounded bg-background"
            placeholder="Age"
            required
          />
          <input
            name="condition"
            className="p-2 border border-input rounded bg-background"
            placeholder="Condition"
            required
          />
          <select
            name="doctor"
            className="p-2 border border-input rounded bg-background"
            required
          >
            <option value="">Select Doctor</option>
            {doctorsList.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </select>
          <div className="col-span-2 flex justify-end gap-2">
            <Link
              href={`/dashboard/patients${buildQuery({ action: undefined })}`}
              className="px-4 py-2 border border-border rounded hover:bg-muted text-sm font-medium flex items-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-success text-success-foreground rounded hover:opacity-90 font-medium text-sm"
            >
              Save Patient
            </button>
          </div>
        </form>
      )}

      {/* Edit Patient Form */}
      {isEditing && editingPatient && (
        <form
          action={updatePatientAction.bind(null, editingPatient._id)}
          className="bg-card p-6 border border-border rounded mb-6 grid grid-cols-2 gap-4 text-foreground shadow-sm"
        >
          <h2 className="col-span-2 text-xl font-bold">Edit Patient</h2>
          <input
            name="name"
            defaultValue={editingPatient.name}
            className="p-2 border border-input rounded bg-background"
            placeholder="Full Name"
            required
          />
          <input
            name="age"
            type="number"
            defaultValue={editingPatient.age}
            className="p-2 border border-input rounded bg-background"
            placeholder="Age"
            required
          />
          <input
            name="condition"
            defaultValue={editingPatient.condition}
            className="p-2 border border-input rounded bg-background"
            placeholder="Condition"
            required
          />
          <select
            name="doctor"
            defaultValue={
              typeof editingPatient.doctor === "object"
                ? editingPatient.doctor._id
                : editingPatient.doctor
            }
            className="p-2 border border-input rounded bg-background"
            required
          >
            <option value="">Select Doctor</option>
            {doctorsList.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </select>
          <div className="col-span-2 flex justify-end gap-2">
            <Link
              href={`/dashboard/patients${buildQuery({ action: undefined, patientId: undefined })}`}
              className="px-4 py-2 border border-border rounded hover:bg-muted text-sm font-medium flex items-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-success text-success-foreground rounded hover:opacity-90 font-medium text-sm"
            >
              Update Patient
            </button>
          </div>
        </form>
      )}

      {/* Patients Table */}
      <div className="bg-card border border-border rounded overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-4 border-b border-border">Name</th>
              <th className="p-4 border-b border-border">Age</th>
              <th className="p-4 border-b border-border">Condition</th>
              <th className="p-4 border-b border-border">Doctor</th>
              <th className="p-4 border-b border-border">Date</th>
              <th className="p-4 border-b border-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialPatients.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No patients found.
                </td>
              </tr>
            ) : (
              initialPatients.map((p) => {
                const doctorName =
                  typeof p.doctor === "object" && p.doctor
                    ? p.doctor.name
                    : "Unassigned";

                return (
                  <tr key={p._id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="p-4">{p.name}</td>
                    <td className="p-4">{p.age}</td>
                    <td className="p-4">{p.condition}</td>
                    <td className="p-4">{doctorName}</td>
                    <td className="p-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 space-x-3">
                      <Link
                        href={`/dashboard/patients${buildQuery({ action: "edit", patientId: p._id })}`}
                        className="text-primary hover:underline font-medium"
                      >
                        Edit
                      </Link>
                      <form action={deletePatientAction.bind(null, p._id)} className="inline">
                        <button
                          type="submit"
                          className="text-destructive hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* URL-driven Pagination Links */}
        <div className="flex items-center justify-between p-4 bg-muted border-t border-border">
          {page > 1 ? (
            <Link
              href={`/dashboard/patients${buildQuery({ page: page - 1 })}`}
              className="px-3 py-1 bg-card border border-border rounded text-sm hover:bg-card/80"
            >
              Previous
            </Link>
          ) : (
            <span className="px-3 py-1 bg-card border border-border rounded text-sm opacity-50 cursor-not-allowed">
              Previous
            </span>
          )}

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={`/dashboard/patients${buildQuery({ page: page + 1 })}`}
              className="px-3 py-1 bg-card border border-border rounded text-sm hover:bg-card/80"
            >
              Next
            </Link>
          ) : (
            <span className="px-3 py-1 bg-card border border-border rounded text-sm opacity-50 cursor-not-allowed">
              Next
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
