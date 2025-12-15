import type { Metadata } from "next";
import { geistMono, geistSans } from "@/lib/fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capston Supabase PWA",
  description:
    "Next.js + Supabase starter with PWA support, ready for Vercel deployments.",
  icons: {
    icon: "/icons/icon-192.png",
    shortcut: "/icons/icon-512.png",
    apple: "/icons/icon-512.png",
    other: [
      {
        rel: "manifest",
        url: "/manifest.webmanifest",
      },
    ],
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
