import dns from "node:dns";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/common/Toast";
import ToastUrlListener from "@/components/common/ToastUrlListener";
import { ThemeProvider } from "@/components/common/ThemeProvider";

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
  title: "DocPulse - Doctor & Patient Tracking System",
  description: "Administrative healthcare portal for doctor and patient relationship management, workload distribution, and clinical analytics",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/logo.svg",
  },
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('docpulse-theme')||'system';var d=document.documentElement;if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark');}else{d.classList.remove('dark');}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <ToastProvider>
            <Suspense fallback={null}>
              <ToastUrlListener />
            </Suspense>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
