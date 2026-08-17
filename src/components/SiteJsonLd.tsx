import { getSiteUrl } from "@/lib/site-url";

type JsonLdProps = {
  brand: string;
  description: string;
  locale: "ar" | "en";
};

export function SiteJsonLd({ brand, description, locale }: JsonLdProps) {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: brand,
        url: siteUrl,
        logo: `${siteUrl}/images/saudi-learners-hero.png`,
        description,
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: brand,
        description,
        inLanguage: locale === "ar" ? "ar" : "en",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "EducationalOrganization",
        name: brand,
        url: siteUrl,
        description,
        areaServed: ["SA", "AE", "KW", "QA", "BH", "OM"],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
