"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";

const DEMO_ACCOUNTS = [
  {
    role: "ADMIN",
    label: "Admin",
    icon: "🛡️",
    email: "admin@example.com",
    password: "admin_password_123",
    description: "Clinic Administrator with full analytics & user management access",
  },
  {
    role: "DOCTOR",
    label: "Doctor",
    icon: "👨‍⚕️",
    email: "john.doe@example.com",
    password: "Doctor@1234",
    description: "Attending Doctor with patient directory & practice workload access",
  },
  {
    role: "PATIENT",
    label: "Patient",
    icon: "🩺",
    email: "janesmith_7b43@careguide.local",
    password: "Patient@1234",
    description: "Enrolled Patient with personal health record & doctor chamber details",
  },
];

export default function LoginForm() {
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin_password_123");
  const [showPassword, setShowPassword] = useState(false);

  const handleSelectRole = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
  };

  const currentAccount = DEMO_ACCOUNTS.find((a) => a.role === selectedRole);

  return (
    <div className="space-y-5">
      {/* Quick Demo Role Selector */}
      <div className="bg-muted/70 p-2.5 rounded-2xl border border-border">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1 mb-2 flex items-center justify-between">
          <span>⚡ Quick Demo Credentials</span>
          <span className="text-[10px] text-primary font-medium">Click to fill</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {DEMO_ACCOUNTS.map((acc) => {
            const isSelected = selectedRole === acc.role;
            return (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleSelectRole(acc)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition cursor-pointer border ${
                  isSelected
                    ? "bg-card text-foreground shadow-xs border-primary/40 font-bold"
                    : "bg-transparent text-muted-foreground border-transparent hover:bg-card/50 hover:text-foreground"
                }`}
              >
                <span className="text-sm">{acc.icon}</span>
                <span>{acc.label}</span>
              </button>
            );
          })}
        </div>
        {currentAccount && (
          <p className="text-[11px] text-muted-foreground mt-2 px-1 text-center italic">
            {currentAccount.description}
          </p>
        )}
      </div>

      {/* Main Login Form */}
      <form action={loginAction} className="space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1">
            Email Address <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            required
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
            <label className="block text-xs sm:text-sm font-semibold text-foreground">
              Password <span className="text-destructive">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-medium p-1 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition cursor-pointer"
        >
          Sign In to Portal
        </button>
      </form>
    </div>
  );
}
