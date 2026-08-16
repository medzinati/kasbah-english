import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { getPublishedNews } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.news.title, description: dict.news.meta };
}

export default async function NewsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const newsItems = await getPublishedNews();

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{dict.news.title}</p>
            <h1>{dict.news.hero}</h1>
            <p>{dict.news.lede}</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap news-list">
            {newsItems.map((item) => (
              <article className="news-item news-item-preview" key={item.slug}>
                <Link href={`/news/${item.slug}`} className="news-media">
                  <Image
                    src={item.image}
                    alt={item.imageAlt[locale]}
                    width={1200}
                    height={675}
                    sizes="(max-width: 800px) 100vw, 720px"
                    quality={75}
                  />
                </Link>
                <div className="news-copy">
                  <time dateTime={item.date}>
                    {new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(item.date))}
                  </time>
                  <h2>
                    <Link href={`/news/${item.slug}`}>{item.title[locale]}</Link>
                  </h2>
                  <p className="news-summary news-summary-clamp">{item.summary[locale]}</p>
                  <Link className="text-link" href={`/news/${item.slug}`}>
                    {dict.news.readMore}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
