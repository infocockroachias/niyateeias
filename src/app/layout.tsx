import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
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
    "Niyatee Civil Services Academy (Niyatee IAS), Bhubaneswar — Odisha's first AI-integrated UPSC coaching institute. Expert faculty, structured Prelims-to-Interview framework, daily current affairs from The Hindu & PIB, AI Mains answer evaluation, AI MCQ practice, 20+ years PYQs and curated books. नियती — From Aspirations to Achievements.",
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
        className={`${inter.variable} ${playfair.variable} ${devanagari.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
