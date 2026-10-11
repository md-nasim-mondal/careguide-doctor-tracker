"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idParam = searchParams.get("id") || "";
  const tokenParam = searchParams.get("token") || "";

  const [id, setId] = useState(idParam);
  const [token, setToken] = useState(tokenParam);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (code.trim().length !== 4) {
      setError("Reset code must be exactly 4 digits.");
      return;
    }

    if (!id.trim() || !token.trim()) {
      setError("Missing user ID or token. Please click the reset link sent to you.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id.trim(),
          token: token.trim(),
          code: code.trim(),
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess("Password has been reset successfully! Redirecting to login...");
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
    <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-8 transition-all">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary text-2xl mb-3">
          🔒
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Set New Password
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Enter the 4-digit reset code and choose a new password
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span className="flex-1 break-words">{error}</span>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs sm:text-sm flex items-start gap-2">
          <span>✅</span>
          <span className="flex-1 break-words">{success}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleReset} className="space-y-3.5">
        {!idParam && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              User ID
            </label>
            <input
              type="text"
              placeholder="e.g. 64f1234567890abcdef12345"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
        )}

        {!tokenParam && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              Reset Token
            </label>
            <input
              type="text"
              placeholder="Paste JWT token here..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
            4-Digit Reset Code *
          </label>
          <input
            type="text"
            maxLength={4}
            placeholder="1234"
            className="w-full px-3 py-2 text-center tracking-widest text-lg font-mono font-bold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
            New Password *
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
            Confirm New Password *
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium text-sm rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 transition"
        >
          {isLoading ? "Resetting Password..." : "Update Password"}
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-6 text-center text-xs sm:text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-8 px-3 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
