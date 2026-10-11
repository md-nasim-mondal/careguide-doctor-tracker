import HeroSection from "@/components/public/HeroSection";
import FeaturesSection from "@/components/public/FeaturesSection";
import WorkflowSection from "@/components/public/WorkflowSection";
import CtaBanner from "@/components/public/CtaBanner";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <CtaBanner />
    </div>
  );
}

