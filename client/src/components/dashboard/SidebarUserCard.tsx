import { IUserProfile } from "@/types";

interface SidebarUserCardProps {
  user: IUserProfile | null;
  roleConfig: {
    label: string;
    badgeClass: string;
    dotClass: string;
  };
}

export function SidebarUserCard({ user, roleConfig }: SidebarUserCardProps) {
  return (
    <div className="p-3.5 sm:p-4 border-b border-border bg-muted/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
            {user?.name || "Care User"}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs ${roleConfig.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleConfig.dotClass}`} />
              <span className="truncate">{roleConfig.label}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
