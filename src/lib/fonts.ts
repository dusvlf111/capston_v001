import { Geist, Geist_Mono } from "next/font/google";

export const geistSansConfig = {
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap" as const,
};

export const geistMonoConfig = {
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap" as const,
  preload: false,
};

export const geistSans = Geist(geistSansConfig);
export const geistMono = Geist_Mono(geistMonoConfig);
