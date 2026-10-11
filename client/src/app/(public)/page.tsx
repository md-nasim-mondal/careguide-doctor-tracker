import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-b from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
              <span>🏥</span>
              <span>Next-Gen Healthcare Management</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Intelligent Doctor & Patient Tracking for Modern Clinics
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Coordinate care delivery with precision. Manage doctor specializations, dynamic patient assignments, and clinical workload analytics in one secure workspace.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:opacity-90 transition text-center"
              >
                Access Admin Portal
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-3.5 bg-card border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition text-center"
              >
                Explore Features
              </Link>
            </div>

            {/* Quick Stat Highlights */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border/60">
              <div className="p-4 bg-card/60 border border-border/40 rounded-xl">
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-xs text-muted-foreground mt-1">Assignment Integrity</p>
              </div>
              <div className="p-4 bg-card/60 border border-border/40 rounded-xl">
                <p className="text-2xl font-bold text-primary">Real-Time</p>
                <p className="text-xs text-muted-foreground mt-1">Workload Analytics</p>
              </div>
              <div className="p-4 bg-card/60 border border-border/40 rounded-xl">
                <p className="text-2xl font-bold text-primary">Zero</p>
                <p className="text-xs text-muted-foreground mt-1">Orphaned Patients</p>
              </div>
              <div className="p-4 bg-card/60 border border-border/40 rounded-xl">
                <p className="text-2xl font-bold text-primary">JWT & RBAC</p>
                <p className="text-xs text-muted-foreground mt-1">Enterprise Security</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">Features & Capabilities</h2>
            <h3 className="text-3xl font-bold text-foreground">Everything Healthcare Teams Need</h3>
            <p className="text-muted-foreground">
              Built specifically to streamline clinical administrative workflows without complicated setups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-background border border-border rounded-xl space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                🩺
              </div>
              <h4 className="text-lg font-bold">Doctor Management</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Maintain comprehensive profiles including hospital affiliations, specialization areas, contact details, and current caseload numbers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-background border border-border rounded-xl space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center text-2xl">
                📋
              </div>
              <h4 className="text-lg font-bold">Patient Relationship Tracking</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Intake patients, diagnose conditions, assign attending physicians, and search or filter by date and medical conditions in seconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-background border border-border rounded-xl space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center text-2xl">
                📊
              </div>
              <h4 className="text-lg font-bold">Analytics & Capacity Charts</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interactive bar and trend visualizations show patients per doctor, daily patient registration surges, and overall hospital throughput.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-background border border-border rounded-xl space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center text-2xl">
                🛡️
              </div>
              <h4 className="text-lg font-bold">Deletion Safeguards</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Built-in relationship verification prevents accidental deletion of doctors who still have active patients assigned to them.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-background border border-border rounded-xl space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h4 className="text-lg font-bold">URL-Driven Architecture</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Server Component driven search, filtering, and pagination ensure fast loads, shareable search states, and zero unnecessary client re-renders.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-background border border-border rounded-xl space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-lg bg-muted text-foreground flex items-center justify-center text-2xl">
                🔐
              </div>
              <h4 className="text-lg font-bold">Role-Based Access Control</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Secure HttpOnly cookie token authentication ensures that sensitive clinical registries are accessible only to verified medical staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">How It Works</h2>
            <h3 className="text-3xl font-bold text-foreground">Effortless Clinical Coordination</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto text-lg">
                1
              </div>
              <h4 className="text-lg font-bold">Register Staff & Doctors</h4>
              <p className="text-sm text-muted-foreground">
                Quickly add doctors with their specialization, contact details, and hospital units to the directory.
              </p>
            </div>

            <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto text-lg">
                2
              </div>
              <h4 className="text-lg font-bold">Intake & Link Patients</h4>
              <p className="text-sm text-muted-foreground">
                Record new patients and select their attending doctor with verified relationship checks.
              </p>
            </div>

            <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto text-lg">
                3
              </div>
              <h4 className="text-lg font-bold">Analyze & Rebalance</h4>
              <p className="text-sm text-muted-foreground">
                Use live charts to inspect caseloads per doctor and reassign patients effortlessly when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-3xl font-extrabold tracking-tight">Ready to streamline your clinic management?</h3>
          <p className="text-primary-foreground/90 text-lg max-w-xl mx-auto">
            Log in to the CareGuide administrative dashboard to oversee doctors, patients, and operational metrics.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block px-8 py-3.5 bg-background text-foreground font-bold rounded-lg shadow-lg hover:bg-background/90 transition"
            >
              Sign In to Admin Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
