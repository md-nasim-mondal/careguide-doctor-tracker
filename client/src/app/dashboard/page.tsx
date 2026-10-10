"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchApi("/dashboard")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-100 rounded shadow">
          <h2 className="text-xl">Total Doctors</h2>
          <p className="text-3xl font-semibold">{data.totalDoctors}</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow">
          <h2 className="text-xl">Total Patients</h2>
          <p className="text-3xl font-semibold">{data.totalPatients}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <div className="flex gap-4">
          <button onClick={() => router.push("/doctors")} className="px-4 py-2 bg-blue-500 text-white rounded">Manage Doctors</button>
          <button onClick={() => router.push("/patients")} className="px-4 py-2 bg-green-500 text-white rounded">Manage Patients</button>
        </div>
      </div>
    </div>
  );
}
