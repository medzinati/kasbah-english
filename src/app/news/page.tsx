import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { newsItems } from "@/data/news";

export const metadata: Metadata = {
  title: "News",
  description: "Updates, launches, and announcements from Kasbah English.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export default function NewsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">News</p>
            <h1>What’s happening at Kasbah English</h1>
            <p>Announcements, launches, and notes for learners — public and clear.</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap news-list">
            {newsItems.map((item) => (
              <article className="news-item" key={item.slug} id={item.slug}>
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <h2>{item.title}</h2>
                <p className="news-summary">{item.summary}</p>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
