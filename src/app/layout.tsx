import type { Metadata } from "next";
import { Amiri, DM_Sans, Fraunces, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Providers } from "@/components/Providers";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-display-ar",
  display: "swap",
  weight: ["400", "700"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-body-ar",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-en",
  display: "swap",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-en",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return {
    title: {
      default:
        locale === "ar"
          ? "قصبة إنجليش | تعلّم الإنجليزية بثقة ومع مجتمع داعم"
          : "Kasbah English | Speak with confidence. Grow with a community.",
      template: `%s | ${dict.brand}`,
    },
    description:
      locale === "ar"
        ? "قصبة إنجليش مجتمع إنجليزي أونلاين للمتعلمين في المغرب والعالم — دروس مجانية للجميع، ومجتمع للأعضاء المقبولين مع نقاشات ولقاءات عبر زوم."
        : "Kasbah English is a friendly online English community for Moroccan and international learners — free courses publicly, discussions and live Zoom meetings for accepted members.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`locale-${locale} ${amiri.variable} ${plexArabic.variable} ${fraunces.variable} ${dmSans.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
