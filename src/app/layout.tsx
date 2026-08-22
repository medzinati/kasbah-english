import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Tajawal } from "next/font/google";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Providers } from "@/components/Providers";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { SiteLevelPopup } from "@/components/SiteLevelPopup";
import { SiteWhatsApp } from "@/components/SiteWhatsApp";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { getSiteUrl } from "@/lib/site-url";
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

const ogImage = {
  url: "/images/saudi-learners-hero.png",
  width: 1200,
  height: 630,
  alt: "Kasbah English",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const siteUrl = getSiteUrl();
  const title =
    locale === "ar"
      ? "قصبة إنجليش | تعلّم الإنجليزية أونلاين بثقة — دروس مجانية ومجتمع"
      : "Kasbah English | Learn English online with confidence — free lessons & community";
  const description =
    locale === "ar"
      ? "تعلّم الإنجليزية أونلاين مع قصبة إنجليش: دروس مجانية، اختبار مستوى، ومجتمع للأعضاء في الخليج والعالم مع لقاءات زوم."
      : "Learn English online with Kasbah English: free lessons, a level test, and a members community for Gulf and international learners with live Zoom practice.";
  const keywords =
    locale === "ar"
      ? [
          "تعلم الإنجليزية",
          "إنجليزي أونلاين",
          "اختبار مستوى إنجليزي",
          "دروس إنجليزي مجانية",
          "مجتمع إنجليزي",
          "قصبة إنجليش",
          "تعلم إنجليزي الخليج",
        ]
      : [
          "learn English online",
          "English level test",
          "free English lessons",
          "English community",
          "Kasbah English",
          "Gulf English learning",
          "Zoom English practice",
        ];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${dict.brand}`,
    },
    description,
    keywords,
    applicationName: dict.brand,
    authors: [{ name: dict.brand }],
    creator: dict.brand,
    publisher: dict.brand,
    alternates: {
      canonical: "/",
      languages: {
        ar: siteUrl,
        en: siteUrl,
        "x-default": siteUrl,
      },
    },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: dict.brand,
      title,
      description,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [{ ...ogImage, alt: dict.brand }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";
  const description =
    locale === "ar"
      ? "تعلّم الإنجليزية أونلاين مع قصبة إنجليش: دروس مجانية، اختبار مستوى، ومجتمع للأعضاء."
      : "Learn English online with Kasbah English: free lessons, a level test, and a members community.";

  return (
    <html lang={locale} dir={dir}>
      <body className={`locale-${locale} ${jakarta.variable} ${tajawal.variable}`}>
        <SiteJsonLd brand={dict.brand} description={description} locale={locale} />
        <GoogleAnalytics />
        <Providers>{children}</Providers>
        <SiteLevelPopup />
        <SiteWhatsApp />
      </body>
    </html>
  );
}
