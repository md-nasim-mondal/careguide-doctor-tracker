"use client";

import { useEffect } from "react";
import Link from "next/link";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard Error Boundary Caught:", error);
  }, [error]);

  const rawMessage = error.message || "";
  const isServerOffline =
    rawMessage.includes("Healthcare server is currently offline") ||
    rawMessage.includes("fetch failed") ||
    rawMessage.includes("ECONNREFUSED") ||
    rawMessage.includes("port 5000");

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto min-h-[70vh] flex items-center justify-center">
      <div className="w-full bg-card border border-border rounded-2xl shadow-lg p-4 sm:p-8 text-center space-y-5 animate-fade-in">
        <div className="inline-flex p-3 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <span className="text-3xl">🔌</span>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground">
            {isServerOffline
              ? "Healthcare Backend Service Offline"
              : "Unable to Load Dashboard Data"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            {isServerOffline
              ? "Cannot communicate with the API server on port 5000. Please verify that the backend server process is active."
              : error.message || "An unexpected error occurred while communicating with the server."}
          </p>
        </div>

        {isServerOffline && (
          <div className="max-w-md mx-auto text-left bg-muted/40 border border-border rounded-xl p-3 text-2xs sm:text-xs text-muted-foreground font-mono space-y-1">
            <p className="font-sans font-semibold text-foreground">Terminal Command to Start Server:</p>
            <p className="text-primary font-bold">cd server &amp;&amp; pnpm run dev</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition shadow-xs text-xs sm:text-sm cursor-pointer"
          >
            🔄 Retry Request
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-muted text-foreground border border-border font-medium rounded-xl hover:bg-muted/80 transition text-xs sm:text-sm cursor-pointer"
          >
            Reload Page
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2 bg-card border border-border text-foreground font-medium rounded-xl hover:bg-muted transition text-xs sm:text-sm"
          >
            Dashboard Home
          </Link>
        </div>
      </div>
    </div>
  );
}
