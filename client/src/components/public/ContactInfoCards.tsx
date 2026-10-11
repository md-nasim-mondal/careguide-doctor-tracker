export default function ContactInfoCards() {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-card border border-border rounded-xl space-y-3 shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
          📍
        </div>
        <h3 className="font-bold text-lg">Hospital Operations HQ</h3>
        <p className="text-sm text-muted-foreground">
          CareGuide Health Informatics Group<br />
          Plot 12, Medical Square, Health City
        </p>
      </div>

      <div className="p-6 bg-card border border-border rounded-xl space-y-3 shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
          ✉️
        </div>
        <h3 className="font-bold text-lg">Direct Communications</h3>
        <p className="text-sm text-muted-foreground">
          Clinical Support: <span className="font-mono text-foreground">support@careguide.local</span><br />
          Administration: <span className="font-mono text-foreground">admin@careguide.local</span>
        </p>
      </div>

      <div className="p-6 bg-card border border-border rounded-xl space-y-3 shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
          ⏰
        </div>
        <h3 className="font-bold text-lg">Support Coverage</h3>
        <p className="text-sm text-muted-foreground">
          Clinical Emergency: <strong>24/7/365</strong><br />
          Standard IT Desk: <strong>Mon - Fri (8:00 AM - 6:00 PM)</strong>
        </p>
      </div>
    </div>
  );
}
