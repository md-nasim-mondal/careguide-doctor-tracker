import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="text-lg font-bold text-primary flex items-center gap-2">
              <span>🩺</span>
              <span>CareGuide Doctor Tracker</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Empowering clinical teams with intelligent doctor-patient relationship tracking, real-time workload allocation, and administrative analytics.
            </p>
            <div className="flex gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary font-medium rounded-full">HIPAA Standards Ready</span>
              <span className="text-xs px-2.5 py-1 bg-success/10 text-success font-medium rounded-full">99.9% Reliable</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Key Features</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Mission</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Portal Access</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground transition-colors">Staff Login</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Live Dashboard</Link></li>
              <li><Link href="/dashboard/doctors" className="hover:text-foreground transition-colors">Doctors Directory</Link></li>
              <li><Link href="/dashboard/patients" className="hover:text-foreground transition-colors">Patient Registry</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 CareGuide Doctor Tracker. Built with Next.js, Express &amp; TypeScript.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Security Protocols</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
