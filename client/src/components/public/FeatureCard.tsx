import type { FeatureItem } from "@/types";

interface FeatureCardProps {
  feature: FeatureItem;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="p-4 sm:p-6 bg-background border border-border rounded-xl space-y-3 hover:border-primary/40 hover:shadow-md transition-all duration-200">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${feature.badgeBg}`}>
        {feature.icon}
      </div>
      <h4 className="text-lg font-bold text-foreground">{feature.title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}
