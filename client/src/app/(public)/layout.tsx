import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareGuide Doctor Tracker - Portal",
  description: "Secure login and public access for CareGuide Doctor Tracker",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 dark:bg-neutral-950">
      {children}
    </div>
  );
}
