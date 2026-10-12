import { BrandLogoIcon } from "@/components/common/BrandLogo";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 antialiased selection:bg-primary/20">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        {/* Animated Brand Pulse Badge */}
        <div className="relative flex items-center justify-center">
          {/* Subtle radiating ping waves */}
          <div className="absolute w-20 h-20 rounded-2xl bg-primary/20 animate-ping opacity-60" />
          <div className="absolute w-24 h-24 rounded-2xl bg-primary/10 animate-pulse" />
          
          <div className="relative shadow-lg rounded-2xl bg-card border border-border p-3.5">
            <BrandLogoIcon size={46} />
          </div>
        </div>

        {/* Text Header */}
        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight flex items-center justify-center gap-1.5">
            <span>Doc</span>
            <span className="text-primary">Pulse</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 ml-1">
              Tracker
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Synchronizing healthcare records &amp; secure session...
          </p>
        </div>

        {/* Progress bar animation */}
        <div className="w-full max-w-xs space-y-2">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden relative">
            <div className="h-full bg-linear-to-r from-sky-500 via-primary to-indigo-600 rounded-full w-2/5 animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>
          <div className="flex items-center justify-between text-2xs text-muted-foreground font-mono">
            <span>Clinical Node</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
