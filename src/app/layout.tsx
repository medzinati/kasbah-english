import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "كاسباه إنجليش | تعلّم الإنجليزية بثقة ومع مجتمع داعم",
    template: "%s | كاسباه إنجليش",
  },
  description:
    "كاسباه إنجليش مجتمع إنجليزي أونلاين للمتعلمين في المغرب والعالم — دروس مجانية للجميع، ومجتمع للأعضاء المقبولين مع نقاشات ولقاءات عبر زوم.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${naskh.variable} ${plexArabic.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
