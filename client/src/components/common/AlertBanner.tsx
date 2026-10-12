import type { AlertBannerProps } from "@/types";

export default function AlertBanner({ message, variant = "error", className = "" }: AlertBannerProps) {
  if (!message) return null;

  const isOfflineIssue =
    message.includes("offline") ||
    message.includes("unreachable") ||
    message.includes("port 5000") ||
    message.includes("ECONNREFUSED");

  const styles = {
    error: "bg-destructive/10 border-destructive/20 text-destructive",
    success: "bg-success/10 border-success/30 text-success",
    info: "bg-primary/10 border-primary/20 text-primary",
  };

  const icons = {
    error: isOfflineIssue ? "🔌" : "⚠️",
    success: "✅",
    info: "ℹ️",
  };

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium flex items-start gap-2.5 shadow-sm ${styles[variant]} ${className}`}
    >
      <span className="shrink-0 text-base leading-tight">{icons[variant]}</span>
      <div className="flex-1 min-w-0 wrap-break-word">
        <span className="leading-snug">{message}</span>
        {isOfflineIssue && (
          <p className="text-2xs opacity-80 mt-1 font-normal">
            Tip: Check that the backend server is running on port 5000 (<code className="font-mono font-semibold">pnpm run dev</code> in server).
          </p>
        )}
      </div>
    </div>
  );
}

export { AlertBanner };

