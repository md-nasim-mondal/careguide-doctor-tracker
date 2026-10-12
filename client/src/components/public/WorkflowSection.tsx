import type { StepItem } from "@/types";
import { WorkflowStepCard } from "./WorkflowStepCard";

const STEPS: StepItem[] = [
  {
    step: 1,
    title: "Register Staff & Doctors",
    description: "Quickly add doctors with their specialization, contact details, and hospital units to the directory.",
  },
  {
    step: 2,
    title: "Intake & Link Patients",
    description: "Record new patients and select their attending doctor with verified relationship checks.",
  },
  {
    step: 3,
    title: "Analyze & Rebalance",
    description: "Use live charts to inspect caseloads per doctor and reassign patients effortlessly when needed.",
  },
];

export default function WorkflowSection() {
  return (
    <section className="py-12 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">How It Works</h2>
          <h3 className="text-xl sm:text-3xl font-bold text-foreground">Effortless Clinical Coordination</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-center">
          {STEPS.map((step) => (
            <WorkflowStepCard key={step.step} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
