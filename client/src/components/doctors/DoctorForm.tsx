import Link from "next/link";
import { createDoctorAction } from "@/actions/doctors";
import PhoneInputWithCountry from "@/components/common/PhoneInputWithCountry";
import type { DoctorFormProps } from "@/types";

export default function DoctorForm({ buildQuery }: DoctorFormProps) {
  return (
    <form
      action={createDoctorAction}
      className="bg-card p-4 sm:p-6 border border-border rounded mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-foreground shadow-sm"
    >
      <input
        name="name"
        className="p-2.5 border border-input rounded bg-background text-xs sm:text-sm"
        placeholder="Full Name"
        required
      />
      <input
        name="specialization"
        className="p-2.5 border border-input rounded bg-background text-xs sm:text-sm"
        placeholder="Specialization"
        required
      />
      <input
        name="hospital"
        className="p-2.5 border border-input rounded bg-background text-xs sm:text-sm"
        placeholder="Hospital"
        required
      />
      <div className="flex flex-col justify-center">
        <PhoneInputWithCountry
          name="phone"
          placeholder="17XXXXXXXX"
          required
        />
      </div>
      <input
        name="email"
        type="email"
        className="p-2.5 border border-input rounded bg-background text-xs sm:text-sm sm:col-span-2"
        placeholder="Email"
        required
      />
      <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
        <Link
          href={`/dashboard/doctors${buildQuery({ action: undefined })}`}
          className="w-full sm:w-auto text-center px-4 py-2 border border-border rounded-xl hover:bg-muted text-xs sm:text-sm font-medium flex items-center justify-center"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-success text-success-foreground rounded-xl hover:opacity-90 font-medium text-xs sm:text-sm cursor-pointer"
        >
          Save Doctor
        </button>
      </div>
    </form>
  );
}
