"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        address?: string;
      } = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      if (formData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }
      if (formData.address.trim()) {
        payload.address = formData.address.trim();
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-8 px-3 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-8 transition-all">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary text-2xl mb-3">
            ✨
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Join the CareGuide Doctor Tracker platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1 wrap-break-word">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs sm:text-sm flex items-start gap-2">
            <span>✅</span>
            <span className="flex-1 wrap-break-word">{success}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Dr. John Doe / Sarah Smith"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                placeholder="Pass@1234"
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Pass@1234"
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                Phone (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+8801700000000"
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                City / Address (Optional)
              </label>
              <input
                type="text"
                name="address"
                placeholder="Dhaka, Bangladesh"
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Password tip: minimum 8 characters with uppercase, number and special character.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium text-sm rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 transition"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs sm:text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
