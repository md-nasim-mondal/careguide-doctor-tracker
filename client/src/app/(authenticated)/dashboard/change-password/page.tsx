"use client";

import { useState } from "react";
import { toast } from "@/components/common/Toast";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      const msg = "New password and confirmation do not match.";
      setError(msg);
      toast.error(msg, "Validation Error");
      return;
    }

    if (newPassword.length < 6) {
      const msg = "New password must be at least 6 characters long.";
      setError(msg);
      toast.error(msg, "Validation Error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      const msg = "Your password has been changed successfully!";
      setSuccess(msg);
      toast.success(msg, "Password Changed");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(msg);
      toast.error(msg, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-6">
      <div className="bg-card rounded-2xl shadow-sm border border-border p-4 sm:p-8">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Change Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Ensure your account is using a long, random password to stay secure
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1 wrap-break-word">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs sm:text-sm flex items-start gap-2">
            <span>✅</span>
            <span className="flex-1 wrap-break-word">{success}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              Current Password *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
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
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 transition"
          >
            {isLoading ? "Saving changes..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
