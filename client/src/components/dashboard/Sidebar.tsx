"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IUserProfile } from "@/types";
import { logoutAction } from "@/actions/auth";

interface SidebarProps {
  user: IUserProfile | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const role = user?.role || "ADMIN";

  const getNavLinks = () => {
    if (role === "RECEIVER") {
      return [
        { name: "My Health Portal", href: "/dashboard", icon: "🩺" },
        { name: "Doctor Directory", href: "/dashboard/doctors", icon: "👨‍⚕️" },
        { name: "Change Password", href: "/dashboard/change-password", icon: "🔒" },
      ];
    }

    if (role === "SENDER") {
      return [
        { name: "Care Coordinator", href: "/dashboard", icon: "🏥" },
        { name: "Doctors Directory", href: "/dashboard/doctors", icon: "🩺" },
        { name: "Patient Care", href: "/dashboard/patients", icon: "👥" },
        { name: "Change Password", href: "/dashboard/change-password", icon: "🔒" },
      ];
    }

    // Default: ADMIN / SUPER_ADMIN
    return [
      { name: "Dashboard Overview", href: "/dashboard", icon: "📊" },
      { name: "Doctor Management", href: "/dashboard/doctors", icon: "🩺" },
      { name: "Patient Management", href: "/dashboard/patients", icon: "👥" },
      { name: "Change Password", href: "/dashboard/change-password", icon: "🔒" },
    ];
  };

  const navLinks = getNavLinks();

  const getRoleLabel = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Administrator";
      case "SENDER":
        return "Care Staff";
      case "RECEIVER":
        return "Patient / User";
      default:
        return role;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-700 text-white font-bold border border-purple-800 shadow-xs";
      case "ADMIN":
        return "bg-blue-700 text-white font-bold border border-blue-800 shadow-xs";
      case "SENDER":
        return "bg-emerald-700 text-white font-bold border border-emerald-800 shadow-xs";
      case "RECEIVER":
        return "bg-amber-700 text-white font-bold border border-amber-800 shadow-xs";
      default:
        return "bg-slate-700 text-white font-bold border border-slate-800 shadow-xs";
    }
  };

  return (
    <>
      {/* Mobile Top Navbar with Hamburger */}
      <div className="md:hidden flex items-center justify-between px-3 sm:px-4 h-14 bg-card border-b border-border sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-base text-primary">
          <span>🩺</span>
          <span className="truncate">CareGuide</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted transition"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-64 max-w-[85vw] bg-card border-r border-border flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 font-bold text-lg text-primary"
          >
            <span className="text-2xl">🩺</span>
            <span className="tracking-tight text-foreground">CareGuide</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close Sidebar"
            className="md:hidden text-muted-foreground hover:text-foreground text-lg"
          >
            ✕
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 sm:p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                {user?.name || "Care User"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wide ${getRoleColor()}`}>
                  {getRoleLabel()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 sm:px-3 py-4 space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Navigation Menu
          </p>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span className="truncate">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions & Logout */}
        <div className="p-3 sm:p-4 border-t border-border mt-auto">
          <form action={logoutAction} className="w-full">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-destructive border border-destructive/20 hover:bg-destructive/10 transition"
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
