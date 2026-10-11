"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPatientAction, updatePatientAction, deletePatientAction } from "@/actions/patients";

type Doctor = { _id: string; name: string };
type Patient = { _id: string; name: string; age: number; condition: string; doctor: Doctor | string; createdAt: string };

export function PatientClientShell({ 
  initialPatients, 
  doctors,
  totalPages, 
  currentPage, 
  currentSearch,
  currentCondition,
  currentDate
}: { 
  initialPatients: Patient[], 
  doctors: Doctor[],
  totalPages: number, 
  currentPage: number, 
  currentSearch: string,
  currentCondition: string,
  currentDate: string
}) {
  const router = useRouter();
  
  // Modals & UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  // Search state
  const [search, setSearch] = useState(currentSearch);
  const [condition, setCondition] = useState(currentCondition);
  const [date, setDate] = useState(currentDate);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (condition) params.set("condition", condition);
    if (date) params.set("date", date);
    params.set("page", "1");
    router.push(`/patients?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (condition) params.set("condition", condition);
    if (date) params.set("date", date);
    params.set("page", page.toString());
    router.push(`/patients?${params.toString()}`);
  };

  const handleSavePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let result;
    if (editingPatient) {
      result = await updatePatientAction(editingPatient._id, formData);
    } else {
      result = await createPatientAction(formData);
    }

    if (result.success) {
      setShowAddForm(false);
      setEditingPatient(null);
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      const result = await deletePatientAction(id);
      if (!result.success) alert(result.message);
    }
  };

  const openEdit = (p: Patient) => {
    setEditingPatient(p);
    setShowAddForm(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex gap-2 flex-1 w-full">
          <input 
            type="text" 
            placeholder="Search name..." 
            className="flex-1 p-3 bg-card border border-border rounded text-foreground focus:ring-2 focus:ring-ring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Condition..." 
            className="flex-1 p-3 bg-card border border-border rounded text-foreground focus:ring-2 focus:ring-ring"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
          <input 
            type="date" 
            className="flex-1 p-3 bg-card border border-border rounded text-foreground focus:ring-2 focus:ring-ring"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={applyFilters} className="px-4 py-2 bg-secondary border border-border text-foreground rounded hover:bg-muted">
            Filter
          </button>
        </div>
        <button onClick={() => { setShowAddForm(!showAddForm); setEditingPatient(null); }} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 whitespace-nowrap">
          {showAddForm ? 'Cancel' : 'Add Patient'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSavePatient} className="bg-card p-6 border border-border rounded mb-6 grid grid-cols-2 gap-4 text-foreground">
          <input name="name" defaultValue={editingPatient?.name} className="p-2 border border-input rounded bg-background" placeholder="Full Name" required />
          <input name="age" type="number" defaultValue={editingPatient?.age} className="p-2 border border-input rounded bg-background" placeholder="Age" required />
          <input name="condition" defaultValue={editingPatient?.condition} className="p-2 border border-input rounded bg-background" placeholder="Condition" required />
          <select name="doctor" defaultValue={typeof editingPatient?.doctor === 'object' ? editingPatient.doctor._id : editingPatient?.doctor} className="p-2 border border-input rounded bg-background" required>
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
          <div className="col-span-2 flex justify-end gap-2">
            <button type="submit" className="px-6 py-2 bg-success text-success-foreground rounded hover:opacity-90">
              {editingPatient ? 'Update Patient' : 'Save Patient'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-4 border-b border-border">Name</th>
              <th className="p-4 border-b border-border">Age</th>
              <th className="p-4 border-b border-border">Condition</th>
              <th className="p-4 border-b border-border">Assigned Doctor</th>
              <th className="p-4 border-b border-border">Created</th>
              <th className="p-4 border-b border-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialPatients.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No patients found.</td></tr>
            ) : (
              initialPatients.map((patient) => (
                <tr key={patient._id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="p-4">{patient.name}</td>
                  <td className="p-4">{patient.age}</td>
                  <td className="p-4">{patient.condition}</td>
                  <td className="p-4">{typeof patient.doctor === 'object' ? patient.doctor.name : 'Unknown'}</td>
                  <td className="p-4">{new Date(patient.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => openEdit(patient)} className="text-primary hover:underline">Edit</button>
                    <button onClick={() => handleDelete(patient._id)} className="text-destructive hover:underline">Delete</button>
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
    </div>
  );
}
