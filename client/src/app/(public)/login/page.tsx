"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full mb-4 p-2 border rounded" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          suppressHydrationWarning
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full mb-6 p-2 border rounded" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          suppressHydrationWarning
        />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
}
