import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { newsItems } from "@/data/news";

export const metadata: Metadata = {
  title: "News",
  description: "Updates and announcements from Kasbah English — community, courses, and member invitations.",
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
            <h1>Stories from the Kasbah</h1>
            <p>Friendly updates on courses, community life, and how to join us.</p>
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
