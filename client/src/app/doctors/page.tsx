"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', specialization: '', hospital: '', phone: '', email: '' });
  const [error, setError] = useState("");

  const loadDoctors = () => {
    setLoading(true);
    fetchApi("/doctors?page=1&limit=50")
      .then((res) => {
        setDoctors(res.data.doctors || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/doctors", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setShowAddForm(false);
      setFormData({ name: '', specialization: '', hospital: '', phone: '', email: '' });
      loadDoctors();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  if (loading) return <div className="p-8">Loading doctors...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Management</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 bg-blue-600 text-white rounded">
          {showAddForm ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      {showAddForm && (
        <form onSubmit={handleCreateDoctor} className="bg-white p-6 shadow rounded mb-6 grid grid-cols-2 gap-4">
          <input className="p-2 border rounded" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input className="p-2 border rounded" placeholder="Specialization" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} required />
          <input className="p-2 border rounded" placeholder="Hospital" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} required />
          <input className="p-2 border rounded" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <input className="p-2 border rounded" type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <div className="col-span-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save Doctor</button>
          </div>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Specialization</th>
              <th className="p-4 border-b">Hospital</th>
              <th className="p-4 border-b">Phone</th>
              <th className="p-4 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">No doctors found.</td></tr>
            ) : (
              doctors.map((doc: { _id: string; name: string; specialization: string; hospital: string; phone: string; email: string }) => (
                <tr key={doc._id} className="hover:bg-gray-50">
                  <td className="p-4 border-b">{doc.name}</td>
                  <td className="p-4 border-b">{doc.specialization}</td>
                  <td className="p-4 border-b">{doc.hospital}</td>
                  <td className="p-4 border-b">{doc.phone}</td>
                  <td className="p-4 border-b">{doc.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
