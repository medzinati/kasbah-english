import { getSiteUrl } from "@/lib/site-url";
import { JsonLdScript } from "@/lib/seo";

type SiteJsonLdProps = {
  brand: string;
  description: string;
  locale: "ar" | "en";
};

export function SiteJsonLd({ brand, description, locale }: SiteJsonLdProps) {
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
        image: `${siteUrl}/images/saudi-learners-hero.png`,
        description,
        areaServed: ["SA", "AE", "KW", "QA", "BH", "OM"],
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: brand,
        description,
        inLanguage: locale === "ar" ? ["ar", "en"] : ["en", "ar"],
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${siteUrl}/#school`,
        name: brand,
        url: siteUrl,
        description,
        areaServed: ["SA", "AE", "KW", "QA", "BH", "OM"],
        parentOrganization: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return <JsonLdScript data={data} />;
}

type FaqItem = { q: string; a: string };

export function FaqJsonLd({ items }: { items: readonly FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return <JsonLdScript data={data} />;
}

type CourseJsonLdProps = {
  name: string;
  description: string;
  url: string;
  image?: string;
  locale: "ar" | "en";
  brand: string;
};

export function CourseJsonLd({ name, description, url, image, locale, brand }: CourseJsonLdProps) {
  const siteUrl = getSiteUrl();
  const absoluteUrl = url.startsWith("http") ? url : `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: absoluteUrl,
    image: image
      ? image.startsWith("http")
        ? image
        : `${siteUrl}${image}`
      : `${siteUrl}/images/saudi-learners-hero.png`,
    inLanguage: locale === "ar" ? "ar" : "en",
    isAccessibleForFree: true,
    provider: {
      "@type": "Organization",
      name: brand,
      sameAs: siteUrl,
    },
  };

  return <JsonLdScript data={data} />;
}

export function ExamsJsonLd({
  brand,
  title,
  description,
  exams,
}: {
  brand: string;
  title: string;
  description: string;
  exams: ReadonlyArray<{ name: string; text: string }>;
}) {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    url: `${siteUrl}/exams`,
    itemListElement: exams.map((exam, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: `${exam.name} — ${brand}`,
        description: exam.text,
        provider: {
          "@type": "Organization",
          name: brand,
          sameAs: siteUrl,
        },
      },
    })),
  };

  return <JsonLdScript data={data} />;
}

type BreadcrumbItem = { name: string; path: string };

export function BreadcrumbJsonLd({ items }: { items: readonly BreadcrumbItem[] }) {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };

  return <JsonLdScript data={data} />;
}

type ArticleJsonLdProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished: string;
  locale: "ar" | "en";
  brand: string;
};

export function ArticleJsonLd({
  title,
  description,
  path,
  image,
  datePublished,
  locale,
  brand,
}: ArticleJsonLdProps) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url,
    image: image
      ? image.startsWith("http")
        ? image
        : `${siteUrl}${image}`
      : `${siteUrl}/images/saudi-learners-hero.png`,
    datePublished,
    dateModified: datePublished,
    inLanguage: locale === "ar" ? "ar" : "en",
    author: {
      "@type": "Organization",
      name: brand,
    },
    publisher: {
      "@type": "Organization",
      name: brand,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/saudi-learners-hero.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return <JsonLdScript data={data} />;
}
