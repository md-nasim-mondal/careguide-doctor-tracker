import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { BrandLogoIcon } from "@/components/common/BrandLogo";

export const instant = false;

type PageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const error = resolvedParams.error ? decodeURIComponent(resolvedParams.error) : "";
  const success = resolvedParams.success ? decodeURIComponent(resolvedParams.success) : "";

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-8 px-3 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-8 transition-all">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <BrandLogoIcon size={44} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Sign In to DocPulse
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Access your doctor and patient tracking portal
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

        {/* Login Form with SSR Server Action */}
        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              name="email"
              defaultValue="admin@example.com"
              placeholder="doctor@careguide.com"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs sm:text-sm font-medium text-foreground">
                Password <span className="text-destructive">*</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              defaultValue="admin_password_123"
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium text-sm rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          >
            Sign In
          </button>
        </form>

        {/* Demo Credentials Tip */}
        <div className="mt-6 p-3 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">💡 Super Admin Default Credentials:</p>
          <p className="break-all font-mono">Email: admin@example.com</p>
          <p className="font-mono">Password: admin_password_123</p>
        </div>

        {/* Info Note */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          Accounts are provisioned by clinic administrators. Doctors &amp; Patients receive credentials via email upon registration.
        </div>
      </div>
    </div>
  );
}
