import Link from "next/link";
import { resetPasswordAction } from "@/actions/auth";

export const instant = false;

type PageProps = {
  searchParams: Promise<{ id?: string; token?: string; error?: string; success?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const idParam = resolvedParams.id || "";
  const tokenParam = resolvedParams.token || "";
  const error = resolvedParams.error ? decodeURIComponent(resolvedParams.error) : "";
  const success = resolvedParams.success ? decodeURIComponent(resolvedParams.success) : "";

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-6 sm:py-8 px-2.5 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-8 transition-all">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary text-2xl mb-3">
            🔒
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Set New Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Enter the 4-digit reset code and choose a new password
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
            <span>✅</span>
            <span className="flex-1 wrap-break-word">{success}</span>
          </div>
        )}

        {/* Reset Password Form with SSR Server Action */}
        <form action={resetPasswordAction} className="space-y-3.5">
          {idParam ? (
            <input type="hidden" name="id" value={idParam} />
          ) : (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                User ID *
              </label>
              <input
                type="text"
                name="id"
                placeholder="e.g. 64f1234567890abcdef12345"
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                required
              />
            </div>
          )}

          {tokenParam ? (
            <input type="hidden" name="token" value={tokenParam} />
          ) : (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                Reset Token *
              </label>
              <input
                type="text"
                name="token"
                placeholder="Paste JWT token here..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              4-Digit Reset Code *
            </label>
            <input
              type="text"
              name="code"
              maxLength={4}
              placeholder="1234"
              className="w-full px-3 py-2 text-center tracking-widest text-lg font-mono font-bold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              New Password *
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="••••••••"
              minLength={6}
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium text-sm rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition cursor-pointer"
          >
            Update Password
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-xs sm:text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
