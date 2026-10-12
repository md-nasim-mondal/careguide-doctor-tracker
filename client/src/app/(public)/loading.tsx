import { BrandLogoIcon } from "@/components/common/BrandLogo";

export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-card border border-border shadow-xs flex items-center justify-center animate-pulse">
          <BrandLogoIcon size={28} />
        </div>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground font-medium animate-pulse">
        Loading DocPulse portal...
      </p>
    </div>
  );
}
