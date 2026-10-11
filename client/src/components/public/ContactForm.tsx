import { submitContactInquiryAction } from "@/actions/contact";
import AlertBanner from "@/components/common/AlertBanner";
import type { ContactFormProps } from "@/types";

export default function ContactForm({ errorMessage, isSent }: ContactFormProps) {
  return (
    <div className="lg:col-span-2 p-8 bg-card border border-border rounded-2xl shadow-sm space-y-6">
      <h2 className="text-2xl font-bold">Send Support Inquiry</h2>
      <p className="text-sm text-muted-foreground">
        Submit a request to our administrative integration engineers. We typically respond within 2 hours.
      </p>

      {errorMessage && (
        <AlertBanner
          variant="error"
          message={errorMessage}
        />
      )}

      {isSent && (
        <AlertBanner
          variant="success"
          message="Thank you! Your support inquiry has been successfully submitted to our clinical engineering team."
        />
      )}

      <form action={submitContactInquiryAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">
            Your Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Dr. Sarah Johnson"
            className="w-full p-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">
            Hospital / Clinic
          </label>
          <input
            name="hospital"
            type="text"
            placeholder="City General Hospital"
            className="w-full p-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            placeholder="sarah.johnson@hospital.org"
            className="w-full p-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">
            Department / Issue Type
          </label>
          <select
            name="topic"
            className="w-full p-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring"
          >
            <option>Doctor Record Management</option>
            <option>Patient Reassignment &amp; Transfers</option>
            <option>Analytics &amp; Reporting Inquiries</option>
            <option>Authentication &amp; Account Recovery</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">
            Message
          </label>
          <textarea
            name="message"
            rows={4}
            placeholder="Describe your question or technical request..."
            className="w-full p-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div className="sm:col-span-2 flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            All communications are protected under HIPAA data privacy protocols.
          </p>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition text-sm shadow-sm"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}
