"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

type Doctor = { _id: string; name: string; specialization: string; hospital: string; phone: string; email: string };
type Patient = { _id: string; name: string; age: number; condition: string; doctor?: { _id: string, name: string } };

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  // Forms & Modals
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', specialization: '', hospital: '', phone: '', email: '' });
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Doctor Patients State
  const [doctorPatients, setDoctorPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // New Patient Form
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [patientForm, setPatientForm] = useState({ name: '', age: 0, condition: '' });

  const loadDoctors = (currentPage: number, search: string) => {
    setLoading(true);
    fetchApi(`/doctors?page=${currentPage}&limit=${limit}&searchTerm=${search}`)
      .then((res) => {
        setDoctors(res.data.doctors || []);
        setTotalPages(res.data.meta?.totalPages || 1);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDoctors(page, searchTerm);
  }, [page, searchTerm]);

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/doctors", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setShowAddForm(false);
      setFormData({ name: '', specialization: '', hospital: '', phone: '', email: '' });
      loadDoctors(page, searchTerm);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const viewDoctorDetails = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setLoadingPatients(true);
    fetchApi(`/doctors/${doc._id}/patients`)
      .then(res => {
        setDoctorPatients(res.data || []);
        setLoadingPatients(false);
      })
      .catch((err: unknown) => {
        console.error(err);
        setLoadingPatients(false);
      });
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    try {
      await fetchApi(`/doctors/${selectedDoctor._id}/patients`, {
        method: "POST",
        body: JSON.stringify({ patientId: patientForm.name }) // Needs real patient selection, simplified for demo
      });
      setShowAddPatientForm(false);
      viewDoctorDetails(selectedDoctor);
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  const handleRemovePatient = async (patientId: string) => {
    if (!selectedDoctor || !confirm("Remove this patient?")) return;
    try {
      await fetchApi(`/doctors/${selectedDoctor._id}/patients/${patientId}`, {
        method: "DELETE"
      });
      viewDoctorDetails(selectedDoctor);
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  if (loading && doctors.length === 0) return <div className="p-8">Loading doctors...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition">
          {showAddForm ? 'Close Form' : 'Add New Doctor'}
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded shadow-sm">{error}</div>}

      {/* SEARCH */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by name, specialization, or hospital..." 
          className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
        />
      </div>

      {/* CREATE FORM */}
      {showAddForm && (
        <form onSubmit={handleCreateDoctor} className="bg-white p-6 shadow-md rounded-lg mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Register New Doctor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input className="p-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="Specialization" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} required />
            <input className="p-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="Hospital" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} required />
            <input className="p-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <input className="p-2 border rounded focus:ring-2 focus:ring-blue-500" type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow transition">Save Doctor</button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DOCTOR LIST */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4 border-b font-medium">Name</th>
                  <th className="p-4 border-b font-medium">Specialization</th>
                  <th className="p-4 border-b font-medium">Hospital</th>
                  <th className="p-4 border-b font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">No doctors found matching criteria.</td></tr>
                ) : (
                  doctors.map((doc) => (
                    <tr key={doc._id} className="hover:bg-blue-50 transition border-b last:border-0">
                      <td className="p-4 font-medium text-gray-900">{doc.name}</td>
                      <td className="p-4 text-gray-600">{doc.specialization}</td>
                      <td className="p-4 text-gray-600">{doc.hospital}</td>
                      <td className="p-4">
                        <button onClick={() => viewDoctorDetails(doc)} className="text-blue-600 hover:underline font-medium">View Details</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* PAGINATION */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 bg-white border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-white border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>

        {/* DOCTOR DETAILS & PATIENTS MODAL/PANEL */}
        <div className="lg:col-span-1">
          {selectedDoctor ? (
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 sticky top-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                <button onClick={() => setSelectedDoctor(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
              </div>
              <p className="text-sm text-gray-600 mb-1"><strong>Spec:</strong> {selectedDoctor.specialization}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Contact:</strong> {selectedDoctor.phone} / {selectedDoctor.email}</p>
              
              <hr className="my-4" />
              
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800">Assigned Patients</h4>
              </div>

              {loadingPatients ? (
                <p className="text-sm text-gray-500">Loading patients...</p>
              ) : doctorPatients.length === 0 ? (
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded border">No patients assigned yet.</p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {doctorPatients.map(pat => (
                    <li key={pat._id} className="flex justify-between items-center bg-gray-50 p-2 rounded border text-sm">
                      <span>{pat.name} <span className="text-xs text-gray-500">({pat.age}y)</span></span>
                      <button onClick={() => handleRemovePatient(pat._id)} className="text-red-500 hover:text-red-700 font-bold" title="Remove Patient">&times;</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 sticky top-6">
              Select a doctor from the list to view their details and assigned patients.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
