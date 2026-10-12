import { BrandLogoIcon } from "@/components/common/BrandLogo";

export default function LoginLoading() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-8 px-3 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 animate-pulse">
          <BrandLogoIcon size={44} />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted rounded-md mx-auto animate-pulse" />
          <div className="h-4 w-64 bg-muted/60 rounded-md mx-auto animate-pulse" />
        </div>

        {/* Skeleton Form */}
        <div className="space-y-3 pt-4">
          <div className="h-10 bg-muted/40 rounded-xl animate-pulse" />
          <div className="h-10 bg-muted/40 rounded-xl animate-pulse" />
          <div className="h-11 bg-primary/20 rounded-xl animate-pulse" />
        </div>

        <p className="text-xs text-muted-foreground pt-2 animate-pulse">
          Verifying session status &amp; loading portal...
        </p>
      </div>
    </div>
  );
}
