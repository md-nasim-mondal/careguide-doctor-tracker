import Link from "next/link";
import { BrandLogoIcon } from "@/components/common/BrandLogo";
import RegisterForm from "@/components/auth/RegisterForm";

export const instant = false;

type PageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function RegisterPage({ searchParams }: PageProps) {
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
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Join the DocPulse Doctor Tracker platform
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

        {/* Register Form using SSR Server Action */}
        <RegisterForm />

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs sm:text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
