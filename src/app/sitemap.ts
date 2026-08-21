import type { MetadataRoute } from "next";
import { freeCourses } from "@/data/courses";
import { getPublishedNews } from "@/lib/news";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/news",
    "/courses",
    "/exams",
    "/level-test",
    "/pricing",
    "/apply",
    "/contact",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/courses" || path === "/exams" || path === "/level-test" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/pricing" || path === "/apply" || path === "/level-test" || path === "/exams" ? 0.9 : 0.7,
  }));

  const courseRoutes: MetadataRoute.Sitemap = freeCourses.map((course) => ({
    url: `${base}/courses/${course.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const news = await getPublishedNews();
    newsRoutes = news.map((item) => ({
      url: `${base}/news/${item.slug}`,
      lastModified: new Date(item.date),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));
  } catch {
    newsRoutes = [];
  }

  return [...staticRoutes, ...courseRoutes, ...newsRoutes];
}
