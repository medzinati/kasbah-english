import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const defaultOg = {
  url: "/images/saudi-learners-hero.png",
  width: 1200,
  height: 630,
};

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  image = defaultOg.url,
  imageAlt,
}: PageMetaInput): Metadata {
  const siteUrl = getSiteUrl();
  const url = path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const ogAlt = imageAlt || title;

  const canonical = path.startsWith("/") ? path : `/${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ar: url,
        en: url,
        "x-default": url,
      },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: image, width: defaultOg.width, height: defaultOg.height, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function JsonLdScript({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
