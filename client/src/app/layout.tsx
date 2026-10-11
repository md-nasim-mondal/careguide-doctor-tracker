import dns from "node:dns";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/common/Toast";
import ToastUrlListener from "@/components/common/ToastUrlListener";

// Manually set Google DNS
if (typeof window === "undefined" && typeof dns?.setServers === "function") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareGuide - Doctor & Patient Tracking System",
  description: "Administrative healthcare portal for doctor and patient management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ToastProvider>
          <Suspense fallback={null}>
            <ToastUrlListener />
          </Suspense>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
