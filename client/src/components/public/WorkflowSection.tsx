import type { StepItem } from "@/types";

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
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">How It Works</h2>
          <h3 className="text-3xl font-bold text-foreground">Effortless Clinical Coordination</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {STEPS.map((step) => (
            <div key={step.step} className="space-y-4 p-6 bg-card border border-border rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto text-lg">
                {step.step}
              </div>
              <h4 className="text-lg font-bold">{step.title}</h4>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
