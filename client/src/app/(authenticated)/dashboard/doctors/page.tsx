import { fetchServerApi } from "@/lib/serverApi";
import { createDoctorAction, updateDoctorAction, deleteDoctorAction } from "@/actions/doctors";
import Link from "next/link";

export const instant = false;

type Doctor = {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
};

type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    doctorId?: string;
    action?: string;
    error?: string;
  }>;
};

export default async function DoctorsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const search = resolvedSearchParams.search || "";
  const doctorId = resolvedSearchParams.doctorId || "";
  const action = resolvedSearchParams.action || "";
  const errorQuery = resolvedSearchParams.error || "";
  const limit = 10;

  let initialDoctors: Doctor[] = [];
  let totalPages = 1;
  let fetchError = "";

  try {
    const res = await fetchServerApi(`/doctors?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
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

  const buildQuery = (params: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
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
    <div className="p-8 max-w-6xl mx-auto text-foreground bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Doctor Management</h1>

      {errorMessage && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded shadow-sm border border-destructive/20">
          {errorMessage}
        </div>
      )}

      {/* Search and Action Bar */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <form method="GET" action="/dashboard/doctors" className="w-1/2 flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Search doctors..."
            defaultValue={search}
            className="flex-1 p-3 bg-card border border-border rounded text-foreground focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 font-medium text-sm"
          >
            Search
          </button>
          {search && (
            <Link
              href="/dashboard/doctors"
              className="px-3 py-2 bg-muted text-foreground border border-border rounded hover:bg-muted/80 flex items-center text-sm"
            >
              Clear
            </Link>
          )}
        </form>

        <div>
          {showAddForm ? (
            <Link
              href={`/dashboard/doctors${buildQuery({ action: undefined })}`}
              className="px-4 py-2 bg-muted text-foreground border border-border rounded hover:bg-muted/80 text-sm font-medium inline-block"
            >
              Cancel
            </Link>
          ) : (
            <Link
              href={`/dashboard/doctors${buildQuery({ action: "add", doctorId: undefined })}`}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 text-sm font-medium inline-block"
            >
              Add Doctor
            </Link>
          )}
        </div>
      </div>

      {/* Add Doctor Form (Server Form) */}
      {showAddForm && (
        <form
          action={createDoctorAction}
          className="bg-card p-6 border border-border rounded mb-6 grid grid-cols-2 gap-4 text-foreground shadow-sm"
        >
          <input
            name="name"
            className="p-2 border border-input rounded bg-background"
            placeholder="Full Name"
            required
          />
          <input
            name="specialization"
            className="p-2 border border-input rounded bg-background"
            placeholder="Specialization"
            required
          />
          <input
            name="hospital"
            className="p-2 border border-input rounded bg-background"
            placeholder="Hospital"
            required
          />
          <input
            name="phone"
            className="p-2 border border-input rounded bg-background"
            placeholder="Phone"
            required
          />
          <input
            name="email"
            type="email"
            className="p-2 border border-input rounded bg-background"
            placeholder="Email"
            required
          />
          <div className="col-span-2 flex justify-end gap-2">
            <Link
              href={`/dashboard/doctors${buildQuery({ action: undefined })}`}
              className="px-4 py-2 border border-border rounded hover:bg-muted text-sm font-medium flex items-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-success text-success-foreground rounded hover:opacity-90 font-medium text-sm"
            >
              Save Doctor
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Doctors Table + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-4 border-b border-border">Name</th>
                <th className="p-4 border-b border-border">Specialization</th>
                <th className="p-4 border-b border-border">Hospital</th>
                <th className="p-4 border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialDoctors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                initialDoctors.map((doc) => (
                  <tr key={doc._id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="p-4">{doc.name}</td>
                    <td className="p-4">{doc.specialization}</td>
                    <td className="p-4">{doc.hospital}</td>
                    <td className="p-4">
                      <Link
                        href={`/dashboard/doctors${buildQuery({ doctorId: doc._id, action: undefined })}`}
                        className="text-primary hover:underline font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* URL-driven Pagination Links */}
          <div className="flex items-center justify-between p-4 bg-muted border-t border-border">
            {page > 1 ? (
              <Link
                href={`/dashboard/doctors${buildQuery({ page: page - 1 })}`}
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
                href={`/dashboard/doctors${buildQuery({ page: page + 1 })}`}
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

        {/* Doctor Details / Edit Panel */}
        <div className="lg:col-span-1">
          {selectedDoctor ? (
            <div className="bg-card border border-border rounded p-6 sticky top-20 text-foreground shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedDoctor.name}</h3>
                <div className="flex gap-2 items-center">
                  {isEditing ? (
                    <Link
                      href={`/dashboard/doctors${buildQuery({ doctorId: selectedDoctor._id, action: undefined })}`}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Cancel
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/doctors${buildQuery({ doctorId: selectedDoctor._id, action: "edit" })}`}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Edit
                    </Link>
                  )}

                  <form action={deleteDoctorAction.bind(null, selectedDoctor._id)} className="inline">
                    <button
                      type="submit"
                      className="text-destructive hover:underline text-sm font-medium"
                    >
                      Delete
                    </button>
                  </form>

                  <Link
                    href={`/dashboard/doctors${buildQuery({ doctorId: undefined, action: undefined })}`}
                    className="text-muted-foreground hover:text-foreground text-sm font-bold ml-1"
                    title="Close"
                  >
                    &times;
                  </Link>
                </div>
              </div>

              {isEditing ? (
                <form action={updateDoctorAction.bind(null, selectedDoctor._id)} className="flex flex-col gap-3">
                  <input
                    name="name"
                    defaultValue={selectedDoctor.name}
                    className="p-2 border border-input rounded bg-background text-sm"
                    placeholder="Full Name"
                    required
                  />
                  <input
                    name="specialization"
                    defaultValue={selectedDoctor.specialization}
                    className="p-2 border border-input rounded bg-background text-sm"
                    placeholder="Specialization"
                    required
                  />
                  <input
                    name="hospital"
                    defaultValue={selectedDoctor.hospital}
                    className="p-2 border border-input rounded bg-background text-sm"
                    placeholder="Hospital"
                    required
                  />
                  <input
                    name="phone"
                    defaultValue={selectedDoctor.phone}
                    className="p-2 border border-input rounded bg-background text-sm"
                    placeholder="Phone"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    defaultValue={selectedDoctor.email}
                    className="p-2 border border-input rounded bg-background text-sm"
                    placeholder="Email"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 mt-2 bg-success text-success-foreground rounded hover:opacity-90 text-sm font-medium"
                  >
                    Update Doctor
                  </button>
                </form>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Specialization:</strong> {selectedDoctor.specialization}
                  </p>
                  <p className="text-sm">
                    <strong>Hospital:</strong> {selectedDoctor.hospital}
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> {selectedDoctor.phone}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {selectedDoctor.email}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted border-2 border-dashed border-border rounded p-8 text-center text-muted-foreground sticky top-20">
              Select a doctor to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
