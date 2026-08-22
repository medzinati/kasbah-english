import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocale } from "@/i18n/get-locale";
import { getSiteDictionary } from "@/lib/site-content";
import { buildPageMetadata } from "@/lib/seo";
import { ExamsJsonLd } from "@/components/SiteJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  const e = dict.examsPage;
  return buildPageMetadata({
    title: e.title,
    description: e.meta,
    path: "/exams",
    image: "/images/news/free-lessons.png",
  });
}

export default async function ExamsPage() {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  const e = dict.examsPage;
  const h = dict.home;
  const photoAlt =
    locale === "ar"
      ? "متعلمون يستعدون لامتحانات الإنجليزية"
      : "Learners preparing for English exams";

  return (
    <>
      <ExamsJsonLd
        brand={dict.brand}
        title={e.title}
        description={e.meta}
        exams={h.exams}
      />
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{e.title}</p>
            <h1>{e.hero}</h1>
            <p>{e.lede}</p>
          </div>
        </section>

        <section className="about-visual" data-reveal="fade" aria-label={photoAlt}>
          <div className="about-visual-media">
            <Image
              src="/images/news/free-lessons.png"
              alt={photoAlt}
              fill
              priority
              sizes="100vw"
              quality={75}
            />
            <div className="about-visual-shade" aria-hidden="true" />
          </div>
        </section>

        <section className="section exams-page-section" data-reveal>
          <div className="wrap">
            <div className="section-head">
              <h2>{e.listTitle}</h2>
            </div>
            <ul className="exams-list exams-page-list">
              {h.exams.map((exam) => (
                <li key={exam.name} data-reveal>
                  <h3>{exam.name}</h3>
                  <p>{exam.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section exams-path-section" data-reveal>
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{e.pathEyebrow}</p>
              <h2>{e.pathTitle}</h2>
            </div>
            <ol className="exams-path-list">
              {e.path.map((item, index) => (
                <li key={item.title} data-reveal>
                  <span className="exams-path-num">{index + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section final-cta" data-reveal="fade">
          <div className="wrap">
            <h2>{e.ctaTitle}</h2>
            <p>{e.ctaText}</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/apply">
                {h.examsCta}
              </Link>
              <Link className="btn btn-ghost dark" href="/level-test">
                {h.ctaLevel}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
