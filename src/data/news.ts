export type { Localized, NewsItem } from "@/data/news-types";
export { newsItems } from "@/data/news-items";

import { newsItems } from "@/data/news-items";

export function getNewsBySlug(slug: string) {
  return newsItems.find((item) => item.slug === slug);
}
