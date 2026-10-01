import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

/* Body: Satoshi (Indian Type Foundry via Fontshare, self-hosted).
   Chosen over Inter for warmer, humanist proportions. */
const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

/* Display: Cabinet Grotesk (ITF/Fontshare, self-hosted).
   Distinctive grotesque voice; not the reflex Playfair/Inter pairing. */
const cabinet = localFont({
  src: [
    { path: "../fonts/CabinetGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/CabinetGrotesk-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/CabinetGrotesk-Extrabold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-cabinet",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Best UPSC Coaching in Odisha | Niyatee Civil Services Academy Bhubaneswar",
  description:
    "Niyatee Civil Services Academy (Niyatee IAS), Bhubaneswar. Odisha's first AI-integrated UPSC coaching institute: expert faculty, a structured Prelims-to-Interview framework, daily current affairs from The Hindu and PIB, AI Mains answer evaluation, AI MCQ practice, 20+ years of PYQs on screen, and curated books. नियती: From Aspirations to Achievements.",
  keywords: [
    "UPSC coaching Odisha",
    "IAS coaching Bhubaneswar",
    "Niyatee IAS",
    "Niyatee Civil Services Academy",
    "OPSC coaching",
    "AI UPSC preparation",
    "UPSC current affairs",
    "best UPSC coaching in Odisha",
  ],
  authors: [{ name: "Niyatee Civil Services Academy" }],
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/icon-192.png",
  },
  openGraph: {
    title: "Best UPSC Coaching in Odisha | Niyatee Civil Services Academy",
    description:
      "AI-powered UPSC preparation & expert mentorship in Bhubaneswar. From Aspirations to Achievements.",
    siteName: "Niyatee Civil Services Academy",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1b3d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${satoshi.variable} ${cabinet.variable} ${devanagari.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
