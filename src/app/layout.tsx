import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kasbah English | English community for Morocco & the world",
    template: "%s | Kasbah English",
  },
  description:
    "Kasbah English is an online English community — free public courses outside, discussions and live meetings inside after you’re accepted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${outfit.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
