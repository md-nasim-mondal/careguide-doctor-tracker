"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IUserProfile } from "@/types";
import { logoutAction } from "@/actions/auth";

interface UserNavDropdownProps {
  user: IUserProfile;
}

export default function UserNavDropdown({ user }: UserNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = user.role || "USER";

  const getRoleBadge = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return { label: "Super Admin", badge: "bg-purple-100 text-purple-800 border-purple-200" };
      case "ADMIN":
        return { label: "Admin", badge: "bg-blue-100 text-blue-800 border-blue-200" };
      case "DOCTOR":
        return { label: "Doctor", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "PATIENT":
        return { label: "Patient", badge: "bg-sky-100 text-sky-800 border-sky-200" };
      default:
        return { label: role, badge: "bg-muted text-muted-foreground border-border" };
    }
  };

  const roleInfo = getRoleBadge();
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border border-border bg-card hover:bg-muted/70 transition shadow-2xs group cursor-pointer"
        aria-label="Open User Menu"
      >
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-sky-500 to-primary text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
          {initial}
        </div>
        <div className="hidden sm:flex flex-col text-left leading-tight max-w-27.5">
          <span className="text-xs font-bold text-foreground truncate">{user.name}</span>
          <span className="text-[10px] text-muted-foreground truncate">{roleInfo.label}</span>
        </div>
        <span className="text-muted-foreground text-[10px] group-hover:translate-y-0.5 transition-transform">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-2xl shadow-xl py-3 px-3 space-y-3 animate-fade-in z-50">
          {/* User Info Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-sky-500 to-primary text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <div className="mt-1">
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleInfo.badge}`}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-foreground bg-primary/10 hover:bg-primary/20 text-primary transition group"
            >
              <span className="flex items-center gap-2">
                <span>📊</span>
                <span>Open Dashboard</span>
              </span>
              <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            {role !== "PATIENT" && (
              <Link
                href="/dashboard/doctors"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <span>🩺</span>
                <span>Doctor Directory</span>
              </Link>
            )}

            {(role === "ADMIN" || role === "SUPER_ADMIN" || role === "DOCTOR") && (
              <Link
                href="/dashboard/patients"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <span>👥</span>
                <span>Patient Care</span>
              </Link>
            )}

            <Link
              href="/dashboard/change-password"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <span>🔒</span>
              <span>Account Security</span>
            </Link>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-border">
            <form action={logoutAction} className="w-full">
              <button
                type="submit"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-destructive border border-destructive/20 hover:bg-destructive/10 transition cursor-pointer"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
