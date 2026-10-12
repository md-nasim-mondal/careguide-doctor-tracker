"use client";

import { useState } from "react";
import { registerAction } from "@/actions/auth";
import PhoneInputWithCountry from "@/components/common/PhoneInputWithCountry";

export default function RegisterForm() {
  const [selectedRole, setSelectedRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");

  return (
    <form action={registerAction} className="space-y-4">
      {/* Account Type Selector */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
          I want to register as:
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setSelectedRole("PATIENT")}
            className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all text-center cursor-pointer ${
              selectedRole === "PATIENT"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🩺 Patient
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("DOCTOR")}
            className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all text-center cursor-pointer ${
              selectedRole === "DOCTOR"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            👨‍⚕️ Doctor
          </button>
        </div>
        <input type="hidden" name="role" value={selectedRole} />
        
        {selectedRole === "DOCTOR" && (
          <div className="mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] leading-relaxed">
            ℹ️ <strong>Doctor Approval:</strong> Registered Doctor accounts require Administrator review & approval before you can sign in to the portal.
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
          Full Name *
        </label>
        <input
          type="text"
          name="name"
          placeholder={selectedRole === "DOCTOR" ? "Dr. John Doe" : "Sarah Smith"}
          className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
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
          placeholder="user@example.com"
          className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          required
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
          Password *
        </label>
        <input
          type="password"
          name="password"
          placeholder="Pass@1234"
          className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
            Phone Number (Optional)
          </label>
          <PhoneInputWithCountry
            name="phone"
            placeholder="17XXXXXXXX"
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
          />
        </div>
      </div>

      {/* Doctor-specific fields */}
      {selectedRole === "DOCTOR" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/60">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              Medical Specialization *
            </label>
            <input
              type="text"
              name="specialization"
              placeholder="Cardiology / Neurology"
              defaultValue="General Medicine"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              required={selectedRole === "DOCTOR"}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              Hospital / Clinic Chamber *
            </label>
            <input
              type="text"
              name="hospital"
              placeholder="City General Hospital"
              defaultValue="DocPulse Medical Center"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              required={selectedRole === "DOCTOR"}
            />
          </div>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        Password requirement: minimum 8 characters with at least one uppercase letter, one digit, and one special character.
      </p>

      <button
        type="submit"
        className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium text-sm rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition cursor-pointer"
      >
        {selectedRole === "DOCTOR" ? "Register as Doctor" : "Create Account"}
      </button>
    </form>
  );
}
