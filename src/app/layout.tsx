import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Tajawal } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SiteLevelPopup } from "@/components/SiteLevelPopup";
import { SiteWhatsApp } from "@/components/SiteWhatsApp";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-ar",
  display: "swap",
  weight: ["400", "500", "700", "800"],
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
        ? "قصبة إنجليش مجتمع إنجليزي عبر الإنترنت للمتعلمين في الخليج والعالم. دروس مجانية للجميع، ومجتمع للأعضاء المقبولين مع نقاشات ولقاءات عبر زوم."
        : "Kasbah English is a friendly online English community for Gulf and international learners. Free courses publicly, discussions and live Zoom meetings for accepted members.",
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
      <body className={`locale-${locale} ${jakarta.variable} ${tajawal.variable}`}>
        <Providers>{children}</Providers>
        <SiteLevelPopup />
        <SiteWhatsApp />
      </body>
    </html>
  );
}
