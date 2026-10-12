import Link from "next/link";
import { forgotPasswordAction } from "@/actions/auth";

export const instant = false;

type PageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const error = resolvedParams.error ? decodeURIComponent(resolvedParams.error) : "";
  const success = resolvedParams.success ? decodeURIComponent(resolvedParams.success) : "";

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-8 px-3 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border p-4 sm:p-8 transition-all">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary text-2xl mb-3">
            🔑
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Forgot Password?
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1 wrap-break-word">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs sm:text-sm flex items-start gap-2">
            <span>✉️</span>
            <span className="flex-1 wrap-break-word">{success}</span>
          </div>
        )}

        {/* Form with SSR Server Action */}
        <form action={forgotPasswordAction} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              Registered Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="user@example.com"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium text-sm rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          >
            Send Reset Instructions
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-xs sm:text-sm text-muted-foreground">
          <Link
            href="/login"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            ← Back to Login Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
