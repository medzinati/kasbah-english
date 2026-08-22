import { prisma } from "@/lib/prisma";
import { newsItems as staticNews } from "@/data/news-items";
import type { NewsItem } from "@/data/news-types";

function paragraphsFromStored(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map(String).filter((line) => line.trim().length > 0);
    }
  } catch {
    // fall through
  }
  return value
    .split(/\n\s*\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function mapDbPost(item: {
  slug: string;
  date: Date;
  imageUrl: string;
  imageAltAr: string;
  imageAltEn: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  bodyAr: string;
  bodyEn: string;
}): NewsItem {
  return {
    slug: item.slug,
    date: item.date.toISOString().slice(0, 10),
    image: item.imageUrl,
    imageAlt: { ar: item.imageAltAr, en: item.imageAltEn },
    title: { ar: item.titleAr, en: item.titleEn },
    summary: { ar: item.summaryAr, en: item.summaryEn },
    body: {
      ar: paragraphsFromStored(item.bodyAr),
      en: paragraphsFromStored(item.bodyEn),
    },
  };
}

export async function getPublishedNews(): Promise<NewsItem[]> {
  const rows = await prisma.newsPost.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });
  if (rows.length === 0) return staticNews;

  const fromDb = rows.map(mapDbPost);
  const dbSlugs = new Set(fromDb.map((item) => item.slug));
  const extras = staticNews.filter((item) => !dbSlugs.has(item.slug));
  return [...fromDb, ...extras].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getPublishedNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  const row = await prisma.newsPost.findFirst({
    where: { slug, published: true },
  });
  if (row) return mapDbPost(row);
  return staticNews.find((item) => item.slug === slug);
}
