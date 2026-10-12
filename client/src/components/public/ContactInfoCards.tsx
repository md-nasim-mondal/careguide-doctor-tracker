import { InfoCard } from "./InfoCard";

export default function ContactInfoCards() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <InfoCard icon="📍" title="Hospital Operations HQ">
        CareGuide Health Informatics Group<br />
        Plot 12, Medical Square, Health City
      </InfoCard>

      <InfoCard icon="✉️" title="Direct Communications">
        Clinical Support: <span className="font-mono text-foreground">support@careguide.local</span><br />
        Administration: <span className="font-mono text-foreground">admin@careguide.local</span>
      </InfoCard>

      <InfoCard icon="⏰" title="Support Coverage">
        Clinical Emergency: <strong>24/7/365</strong><br />
        Standard IT Desk: <strong>Mon - Fri (8:00 AM - 6:00 PM)</strong>
      </InfoCard>
    </div>
  );
}
