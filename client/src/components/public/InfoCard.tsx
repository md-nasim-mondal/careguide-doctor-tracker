import React from "react";

interface InfoCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

export function InfoCard({ icon, title, children }: InfoCardProps) {
  return (
    <div className="p-4 sm:p-6 bg-card border border-border rounded-xl space-y-2.5 sm:space-y-3 shadow-sm hover:border-primary/40 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
        {icon}
      </div>
      <h3 className="font-bold text-base sm:text-lg text-foreground">{title}</h3>
      <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
}
