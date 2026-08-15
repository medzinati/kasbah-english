import type { Metadata } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kasbah English | Speak with confidence. Grow with a community.",
    template: "%s | Kasbah English",
  },
  description:
    "Kasbah English is a friendly online English community for Moroccan and international learners — free courses publicly, discussions and live Zoom meetings for accepted members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${dmSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
