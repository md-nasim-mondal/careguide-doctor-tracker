import { changePasswordAction } from "@/actions/auth";

export const instant = false;

type PageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function ChangePasswordPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const error = resolvedParams.error ? decodeURIComponent(resolvedParams.error) : "";
  const success = resolvedParams.success ? decodeURIComponent(resolvedParams.success) : "";

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-6">
      <div className="bg-card rounded-2xl shadow-sm border border-border p-4 sm:p-8">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Change Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Ensure your account is using a long, random password to stay secure
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1 wrap-break-word">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs sm:text-sm flex items-start gap-2">
            <span>✅</span>
            <span className="flex-1 wrap-break-word">{success}</span>
          </div>
        )}

        <form action={changePasswordAction} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
              Current Password *
            </label>
            <input
              type="password"
              name="oldPassword"
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
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
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-xl shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
