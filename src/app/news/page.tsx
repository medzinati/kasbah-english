import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { newsItems } from "@/data/news";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.news.title, description: dict.news.meta };
}

export default async function NewsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

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
              <article className="news-item" key={item.slug} id={item.slug}>
                <time dateTime={item.date}>
                  {new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(item.date))}
                </time>
                <h2>{item.title[locale]}</h2>
                <p className="news-summary">{item.summary[locale]}</p>
                <p>{item.body[locale]}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
