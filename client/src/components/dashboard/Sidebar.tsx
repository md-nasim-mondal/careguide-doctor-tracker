"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IUserProfile } from "@/types";
import { logoutAction } from "@/actions/auth";
import BrandLogo from "@/components/common/BrandLogo";

interface SidebarProps {
  user: IUserProfile | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const role = user?.role || "ADMIN";

  const getNavLinks = () => {
    if (role === "PATIENT") {
      return [
        { name: "My Health Portal", href: "/dashboard", icon: "🩺" },
        { name: "Doctor Directory", href: "/dashboard/doctors", icon: "👨‍⚕️" },
        { name: "Change Password", href: "/dashboard/change-password", icon: "🔒" },
      ];
    }

    if (role === "DOCTOR") {
      return [
        { name: "Doctor Dashboard", href: "/dashboard", icon: "🏥" },
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
      { name: "User Management", href: "/dashboard/users", icon: "🛡️" },
      { name: "Change Password", href: "/dashboard/change-password", icon: "🔒" },
    ];
  };

  const navLinks = getNavLinks();

  const getRoleConfig = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return {
          label: "Super Admin",
          badgeClass: "bg-purple-100 text-purple-900 border-purple-300 font-bold",
          dotClass: "bg-purple-600",
        };
      case "ADMIN":
        return {
          label: "Administrator",
          badgeClass: "bg-blue-100 text-blue-900 border-blue-300 font-bold",
          dotClass: "bg-blue-600",
        };
      case "DOCTOR":
        return {
          label: "Doctor / Specialist",
          badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold",
          dotClass: "bg-emerald-600",
        };
      case "PATIENT":
        return {
          label: "Patient",
          badgeClass: "bg-sky-100 text-sky-900 border-sky-300 font-bold",
          dotClass: "bg-sky-600",
        };
      default:
        return {
          label: role,
          badgeClass: "bg-muted text-muted-foreground border-border",
          dotClass: "bg-muted-foreground",
        };
    }
  };

  const roleConfig = getRoleConfig();

  return (
    <>
      {/* Mobile Top Navbar with Hamburger */}
      <div className="md:hidden flex items-center justify-between px-2.5 sm:px-4 h-14 bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-2 min-w-0">
          <BrandLogo size="sm" href="/dashboard" />
          <Link
            href="/"
            title="Return to Public Home Website"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border transition"
          >
            <span>🌐</span>
            <span>Home</span>
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted transition text-sm shrink-0"
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
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-64 max-w-[88vw] bg-card border-r border-border flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-3 sm:px-4 border-b border-border">
          <BrandLogo size="md" href="/dashboard" />
          <div className="flex items-center gap-1">
            <Link
              href="/"
              title="Return to Public Home Website"
              className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg border border-border/80 transition"
            >
              <span>🌐</span>
              <span className="text-[11px]">Home</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Sidebar"
              className="md:hidden text-muted-foreground hover:text-foreground text-lg p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3.5 sm:p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                {user?.name || "Care User"}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs ${roleConfig.badgeClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleConfig.dotClass}`} />
                  <span className="truncate">{roleConfig.label}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 sm:px-3 py-4 space-y-1">
          <div className="px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <span>Navigation Menu</span>
            <span className="text-[10px] lowercase font-normal opacity-70">portal</span>
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-base group-hover:scale-110 transition-transform">{link.icon}</span>
                  <span className="truncate">{link.name}</span>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-white shadow-xs shrink-0 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions, Home Website Link & Logout */}
        <div className="p-3 sm:p-4 border-t border-border mt-auto space-y-2 bg-card">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-foreground bg-muted/60 hover:bg-muted border border-border transition shadow-2xs group"
          >
            <span className="flex items-center gap-2">
              <span className="group-hover:scale-110 transition-transform">🌐</span>
              <span>Back to Home Website</span>
            </span>
            <span className="text-xs text-muted-foreground group-hover:translate-x-0.5 transition-transform">↗</span>
          </Link>

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
