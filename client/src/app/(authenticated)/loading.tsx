export default function DashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div className="space-y-2">
          <div className="h-7 w-48 sm:w-64 bg-muted rounded-lg" />
          <div className="h-4 w-72 sm:w-96 bg-muted/60 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-24 bg-muted rounded-xl" />
          <div className="h-9 w-32 bg-muted rounded-xl" />
        </div>
      </div>

      {/* 4 Stat Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-muted rounded-md" />
              <div className="w-8 h-8 rounded-xl bg-muted/80" />
            </div>
            <div className="h-8 w-16 bg-muted rounded-lg" />
            <div className="h-3 w-32 bg-muted/50 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="h-10 w-full sm:w-80 bg-muted rounded-xl" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="h-10 w-28 bg-muted rounded-xl" />
          <div className="h-10 w-28 bg-muted rounded-xl" />
        </div>
      </div>

      {/* Table / Content Skeleton */}
      <div className="rounded-2xl bg-card border border-border shadow-2xs overflow-hidden">
        {/* Table Header Row Skeleton */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="h-4 w-32 bg-muted rounded-md" />
          <div className="h-4 w-20 bg-muted rounded-md" />
        </div>

        {/* Shimmer Rows */}
        <div className="divide-y divide-border/60">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-36 sm:w-48 bg-muted rounded-md" />
                  <div className="h-3 w-24 sm:w-32 bg-muted/60 rounded-md" />
                </div>
              </div>
              <div className="hidden sm:block h-3.5 w-28 bg-muted/60 rounded-md" />
              <div className="h-6 w-20 bg-muted/80 rounded-full" />
              <div className="h-8 w-16 bg-muted rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
