"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("DocPulse Root Global Error:", error);
  }, [error]);

  const rawMessage = error.message || "";
  const isServerOffline =
    rawMessage.includes("Healthcare server is currently offline") ||
    rawMessage.includes("fetch failed") ||
    rawMessage.includes("ECONNREFUSED") ||
    rawMessage.includes("port 5000");

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-5">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="text-3xl">🔌</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {isServerOffline ? "Backend Server Offline" : "System Error Occurred"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isServerOffline
              ? "Unable to connect to the healthcare backend on port 5000. Please ensure the backend server is running and try again."
              : error.message || "An unexpected error occurred while loading the application."}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition cursor-pointer"
            >
              🔄 Retry Connection
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs sm:text-sm transition cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
