interface AlertBannerProps {
  message?: string;
  variant?: "error" | "success" | "info";
  className?: string;
}

export default function AlertBanner({ message, variant = "error", className = "" }: AlertBannerProps) {
  if (!message) return null;

  const styles = {
    error: "bg-destructive/10 border-destructive/20 text-destructive",
    success: "bg-success/10 border-success/30 text-success",
    info: "bg-primary/10 border-primary/20 text-primary",
  };

  const icons = {
    error: "❌",
    success: "✅",
    info: "ℹ️",
  };

  return (
    <div
      className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 shadow-sm ${styles[variant]} ${className}`}
    >
      <span>{icons[variant]}</span>
      <span>{message}</span>
    </div>
  );
}

export { AlertBanner };

