import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { newsItems } from "@/data/news";

export const metadata: Metadata = {
  title: "الأخبار",
  description: "أخبار وتحديثات كاسباه إنجليش — المجتمع، الدروس، ودعوات الانضمام.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar", {
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
            <p className="eyebrow">الأخبار</p>
            <h1>حكايات من كاسباه</h1>
            <p>تحديثات ودّية حول الدروس، حياة المجتمع، وكيف تنضم إلينا.</p>
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
