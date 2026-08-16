import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { newsItems as staticNews } from "@/data/news-items";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { getPublishedNewsBySlug } from "@/lib/news";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return staticNews.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedNewsBySlug(slug);
  const locale = await getLocale();
  if (!item) return {};
  return {
    title: item.title[locale],
    description: item.summary[locale],
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublishedNewsBySlug(slug);
  if (!item) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const paragraphs = item.body[locale];

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <article className="news-article">
          <div className="wrap news-article-inner">
            <p className="eyebrow">
              <Link href="/news">{dict.news.title}</Link>
            </p>
            <time dateTime={item.date}>
              {new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(item.date))}
            </time>
            <h1>{item.title[locale]}</h1>
            <p className="news-article-lede">{item.summary[locale]}</p>

            <div className="news-article-media">
              <Image
                src={item.image}
                alt={item.imageAlt[locale]}
                width={1200}
                height={675}
                sizes="(max-width: 800px) 100vw, 800px"
                quality={78}
                priority
              />
            </div>

            <div className="news-article-body">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>

            <div className="news-article-cta">
              <Link className="btn btn-primary" href="/apply">
                {dict.nav.applyNow}
              </Link>
              <Link className="btn btn-ghost dark" href="/news">
                {dict.news.backToList}
              </Link>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
