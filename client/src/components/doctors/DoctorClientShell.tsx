"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDoctorAction, updateDoctorAction, deleteDoctorAction } from "@/actions/doctors";

type Doctor = { _id: string; name: string; specialization: string; hospital: string; phone: string; email: string };

export function DoctorClientShell({ 
  initialDoctors, 
  totalPages, 
  currentPage, 
  currentSearch 
}: { 
  initialDoctors: Doctor[], 
  totalPages: number, 
  currentPage: number, 
  currentSearch: string 
}) {
  const router = useRouter();
  
  // Modals & UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = (term: string) => {
    router.push(`/doctors?search=${encodeURIComponent(term)}&page=1`);
  };

  const handlePageChange = (page: number) => {
    router.push(`/doctors?search=${encodeURIComponent(currentSearch)}&page=${page}`);
  };

  const handleCreateDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createDoctorAction(formData);
    if (result.success) {
      setShowAddForm(false);
      // form resets via HTML automatically on unmount or we can ref it
    } else {
      alert(result.message);
    }
  };

  const handleUpdateDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    const formData = new FormData(e.currentTarget);
    const result = await updateDoctorAction(selectedDoctor._id, formData);
    if (result.success) {
      setIsEditing(false);
      // Update local state selectively or rely on Server Action revalidation
      // We rely on Server Action revalidation to refresh the list, but we update selected doc
      setSelectedDoctor({
        _id: selectedDoctor._id,
        name: formData.get("name") as string,
        specialization: formData.get("specialization") as string,
        hospital: formData.get("hospital") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
      });
    } else {
      alert(result.message);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    
    setIsDeleting(true);
    const result = await deleteDoctorAction(selectedDoctor._id);
    setIsDeleting(false);
    
    if (result.success) {
      setSelectedDoctor(null);
      setIsEditing(false);
    } else {
      alert(result.message);
    }
  };

  const viewDoctorDetails = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <input 
          type="text" 
          placeholder="Search doctors..." 
          className="w-1/2 p-3 bg-card border border-border rounded text-foreground focus:ring-2 focus:ring-ring"
          defaultValue={currentSearch}
          onBlur={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.currentTarget.value)}
        />
        <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90">
          {showAddForm ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateDoctor} className="bg-card p-6 border border-border rounded mb-6 grid grid-cols-2 gap-4 text-foreground">
          <input name="name" className="p-2 border border-input rounded bg-background" placeholder="Full Name" required />
          <input name="specialization" className="p-2 border border-input rounded bg-background" placeholder="Specialization" required />
          <input name="hospital" className="p-2 border border-input rounded bg-background" placeholder="Hospital" required />
          <input name="phone" className="p-2 border border-input rounded bg-background" placeholder="Phone" required />
          <input name="email" type="email" className="p-2 border border-input rounded bg-background" placeholder="Email" required />
          <div className="col-span-2 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-success text-success-foreground rounded hover:opacity-90">Save Doctor</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded overflow-hidden">
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
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No doctors found.</td></tr>
              ) : (
                initialDoctors.map((doc) => (
                  <tr key={doc._id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="p-4">{doc.name}</td>
                    <td className="p-4">{doc.specialization}</td>
                    <td className="p-4">{doc.hospital}</td>
                    <td className="p-4">
                      <button onClick={() => viewDoctorDetails(doc)} className="text-primary hover:underline">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-4 bg-muted border-t border-border">
            <button 
              disabled={currentPage <= 1} 
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 bg-card border border-border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage >= totalPages} 
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 bg-card border border-border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedDoctor ? (
            <div className="bg-card border border-border rounded p-6 sticky top-6 text-foreground">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedDoctor.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(!isEditing)} className="text-primary hover:underline text-sm">
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                  <button onClick={handleDeleteDoctor} disabled={isDeleting} className="text-destructive hover:underline text-sm disabled:opacity-50">
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                  <button onClick={() => { setSelectedDoctor(null); setIsEditing(false); }} className="text-muted-foreground hover:text-foreground text-sm">&times;</button>
                </div>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleUpdateDoctor} className="flex flex-col gap-3">
                  <input name="name" defaultValue={selectedDoctor.name} className="p-2 border border-input rounded bg-background text-sm" placeholder="Full Name" required />
                  <input name="specialization" defaultValue={selectedDoctor.specialization} className="p-2 border border-input rounded bg-background text-sm" placeholder="Specialization" required />
                  <input name="hospital" defaultValue={selectedDoctor.hospital} className="p-2 border border-input rounded bg-background text-sm" placeholder="Hospital" required />
                  <input name="phone" defaultValue={selectedDoctor.phone} className="p-2 border border-input rounded bg-background text-sm" placeholder="Phone" required />
                  <input name="email" type="email" defaultValue={selectedDoctor.email} className="p-2 border border-input rounded bg-background text-sm" placeholder="Email" required />
                  <button type="submit" className="px-4 py-2 mt-2 bg-success text-success-foreground rounded hover:opacity-90 text-sm">Update Doctor</button>
                </form>
              ) : (
                <>
                  <p className="text-sm mb-1"><strong>Spec:</strong> {selectedDoctor.specialization}</p>
                  <p className="text-sm mb-1"><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
                  <p className="text-sm"><strong>Contact:</strong> {selectedDoctor.phone} / {selectedDoctor.email}</p>
                </>
              )}
            </div>
          ) : (
            <div className="bg-muted border-2 border-dashed border-border rounded p-8 text-center text-muted-foreground sticky top-6">
              Select a doctor to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
