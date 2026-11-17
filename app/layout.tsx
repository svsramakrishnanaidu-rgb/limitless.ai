import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LIMITLESS — Beyond Boundaries. Towards Better Health.",
    template: "%s · LIMITLESS",
  },
  description:
    "LIMITLESS is a health education and wellness companion: traditional healthcare knowledge, medicinal plant safety, yoga and meditation, nutrition, personal health tracking, reminders and an AI assistant.",
  applicationName: "LIMITLESS",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "LIMITLESS — Beyond Boundaries. Towards Better Health.",
    description:
      "Traditional healthcare knowledge, plant safety, yoga, nutrition and a private health tracker in one calm, accessible application.",
    url: siteUrl,
    siteName: "LIMITLESS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LIMITLESS",
    description: "Beyond Boundaries. Towards Better Health.",
  },
  robots: { index: true, follow: true },
  category: "health",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08070B" },
    { media: "(prefers-color-scheme: light)", color: "#F7F5F8" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="classic" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
