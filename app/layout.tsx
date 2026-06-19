import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PropertyCheck — AI-powered rental inspections",
    template: "%s · PropertyCheck",
  },
  description:
    "Upload inspection photos, get structured condition reports, and produce UK Tenant Fees Act–compliant deposit-comparison PDFs. Data stays in your own OneDrive.",
  applicationName: "PropertyCheck",
  authors: [{ name: "PropertyCheck" }],
  keywords: [
    "rental inspection",
    "check-in report",
    "check-out report",
    "deposit comparison",
    "UK Tenant Fees Act",
    "property inventory",
  ],
  openGraph: {
    title: "PropertyCheck — AI-powered rental inspections",
    description:
      "AI-categorised inspection reports + deposit-comparison PDFs, saved straight to your OneDrive.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
