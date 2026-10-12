import Link from "next/link";
import { BrandLogoIcon } from "@/components/common/BrandLogo";

export const instant = false;

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-6 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-8 text-center transition-all">
        {/* Header */}
        <div className="inline-flex items-center justify-center mb-4">
          <BrandLogoIcon size={48} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Administrative Intake Only
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
          Public self-registration is disabled for this healthcare tracker. All Doctor and Patient profiles are securely provisioned and activated by clinic administrators.
        </p>

        {/* Informational Callout */}
        <div className="my-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-left text-xs sm:text-sm text-foreground space-y-2">
          <p className="font-semibold text-primary flex items-center gap-1.5">
            <span>ℹ️</span> How account access works:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-xs">
            <li>When an administrator registers a Doctor or Patient, their login credentials and portal links are automatically delivered via email.</li>
            <li>If you are a staff member or patient awaiting access, please contact your clinic administration desk.</li>
          </ul>
        </div>

        {/* Action Button */}
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow hover:bg-primary/90 transition"
        >
          Go to Sign In Portal
        </Link>
      </div>
    </div>
  );
}
