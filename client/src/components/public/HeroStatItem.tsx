interface HeroStatItemProps {
  value: string;
  label: string;
}

export function HeroStatItem({ value, label }: HeroStatItemProps) {
  return (
    <div className="p-3 sm:p-4 bg-card/60 border border-border/40 rounded-xl hover:border-primary/30 transition-colors">
      <p className="text-xl sm:text-2xl font-bold text-primary">{value}</p>
      <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
