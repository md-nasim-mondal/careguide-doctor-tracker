"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request.");
      }

      setMessage(
        data.message ||
          "Password reset link generated! Check your email or check the server terminal in local development mode."
      );
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
            🔑
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Forgot Password?
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Enter your registered email address to receive password reset instructions
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
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs sm:text-sm flex items-start gap-2">
            <span>✉️</span>
            <span className="flex-1 wrap-break-word">{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              Registered Email
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium text-sm rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 transition"
          >
            {isLoading ? "Sending Instructions..." : "Send Reset Instructions"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <Link
            href="/login"
            className="text-primary font-medium hover:underline flex items-center gap-1"
          >
            ← Back to Login
          </Link>
          <Link
            href="/register"
            className="text-muted-foreground hover:text-foreground font-medium"
          >
            New account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}
