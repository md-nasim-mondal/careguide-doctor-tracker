import type { StepItem } from "@/types";

interface WorkflowStepCardProps {
  step: StepItem;
}

export function WorkflowStepCard({ step }: WorkflowStepCardProps) {
  return (
    <div className="space-y-3 p-4 sm:p-6 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-sm transition-all duration-200">
      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto text-base sm:text-lg shadow-2xs">
        {step.step}
      </div>
      <h4 className="text-base sm:text-lg font-bold text-foreground">{step.title}</h4>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {step.description}
      </p>
    </div>
  );
}
