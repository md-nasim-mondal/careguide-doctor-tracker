"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/patients?page=1&limit=50")
      .then((res) => {
        setPatients(res.data.patients || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading patients...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Age</th>
              <th className="p-4 border-b">Condition</th>
              <th className="p-4 border-b">Assigned Doctor</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">No patients found.</td>
              </tr>
            ) : (
              patients.map((pat: { _id: string; name: string; age: number; condition: string; doctor?: { name: string } }) => (
                <tr key={pat._id} className="hover:bg-gray-50">
                  <td className="p-4 border-b">{pat.name}</td>
                  <td className="p-4 border-b">{pat.age}</td>
                  <td className="p-4 border-b">{pat.condition}</td>
                  <td className="p-4 border-b">{pat.doctor?.name || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
