"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandLogoIcon } from "@/components/common/BrandLogo";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console for local debugging
    console.error("DocPulse Client Caught Error Boundary:", error);
  }, [error]);

  const rawMessage = error.message || "";
  const isServerOffline =
    rawMessage.includes("Healthcare server is currently offline") ||
    rawMessage.includes("fetch failed") ||
    rawMessage.includes("ECONNREFUSED") ||
    rawMessage.includes("port 5000") ||
    rawMessage.includes("unreachable");

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-2.5 sm:p-6">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl p-4 sm:p-8 text-center space-y-5 sm:space-y-6 animate-fade-in">
        {/* Brand Logo & Status Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <BrandLogoIcon size={32} />
            <span className="font-extrabold text-base tracking-tight text-foreground">
              Doc<span className="text-primary">Pulse</span>
            </span>
          </div>

          <div className="inline-flex p-3 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-xs">
            {isServerOffline ? (
              <span className="text-3xl">🔌</span>
            ) : (
              <span className="text-3xl">⚠️</span>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
            {isServerOffline ? "Backend Server Offline" : "Application Error"}
          </span>
        </div>

        {/* Title and Message */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            {isServerOffline
              ? "Cannot Connect to Healthcare Server"
              : "Something Went Wrong"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isServerOffline
              ? "The DocPulse backend API server (port 5000) is unreachable or not running. Please make sure the backend server process is started and try again."
              : error.message || "An unexpected error occurred while loading this page."}
          </p>
        </div>

        {/* Diagnostic Card for Local Development */}
        {isServerOffline && (
          <div className="text-left bg-muted/40 border border-border/80 rounded-xl p-3.5 text-2xs sm:text-xs text-muted-foreground space-y-1.5 font-mono">
            <p className="font-sans font-bold text-foreground">💡 Troubleshooting Steps:</p>
            <p>1. Open server terminal: <code className="text-primary font-semibold">cd server</code></p>
            <p>2. Start the dev server: <code className="text-primary font-semibold">pnpm run dev</code></p>
            <p>3. Verify listening on: <code className="text-primary font-semibold">http://localhost:5000</code></p>
          </div>
        )}

        {/* Error Digest (if available) */}
        {error.digest && !isServerOffline && (
          <p className="text-2xs font-mono text-muted-foreground">
            Error Reference ID: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition shadow-xs text-xs sm:text-sm cursor-pointer"
          >
            🔄 Try Again
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-2.5 bg-muted text-foreground border border-border font-medium rounded-xl hover:bg-muted/80 transition text-xs sm:text-sm"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-2.5 bg-muted text-foreground border border-border font-medium rounded-xl hover:bg-muted/80 transition text-xs sm:text-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
