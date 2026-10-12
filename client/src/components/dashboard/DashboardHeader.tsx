"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IUserProfile } from "@/types";
import ThemeToggle from "@/components/common/ThemeToggle";

interface DashboardHeaderProps {
  user: IUserProfile | null;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();

  // Helper to format breadcrumb / section title
  const getSectionTitle = () => {
    if (pathname.includes("/dashboard/doctors")) return "Doctors Directory";
    if (pathname.includes("/dashboard/patients")) return "Patient Directory";
    if (pathname.includes("/dashboard/users")) return "User Management";
    if (pathname.includes("/dashboard/change-password")) return "Security & Password";
    return "Clinical Overview";
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case "SUPER_ADMIN":
        return { label: "Super Admin", color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20" };
      case "ADMIN":
        return { label: "Admin", color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20" };
      case "DOCTOR":
        return { label: "Doctor", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
      case "PATIENT":
        return { label: "Patient", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" };
      default:
        return { label: "Portal", color: "text-muted-foreground bg-muted border-border" };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <header className="h-14 sm:h-16 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-20 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 transition-colors">
      {/* Left: Breadcrumbs / Section Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span>Portal</span>
          <span>/</span>
        </div>
        <h2 className="text-xs sm:text-sm font-bold text-foreground truncate">
          {getSectionTitle()}
        </h2>
        <span
          className={`hidden md:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleBadge.color}`}
        >
          {roleBadge.label}
        </span>
      </div>

      {/* Right: Go to Website & Theme Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          href="/"
          title="Return to Public Website"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-foreground bg-muted/60 hover:bg-muted border border-border/80 transition-all duration-150 shadow-2xs group"
        >
          <span className="text-sm group-hover:scale-110 transition-transform">🌐</span>
          <span className="hidden sm:inline">Go to Website</span>
          <span className="sm:hidden">Website</span>
          <span className="text-[10px] text-muted-foreground group-hover:translate-x-0.5 transition-transform">↗</span>
        </Link>

        {/* Theme Switcher Dropdown */}
        <ThemeToggle align="right" showLabel={true} />
      </div>
    </header>
  );
}
