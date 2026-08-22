import type { Metadata } from "next";
import { LevelTestQuiz } from "@/components/LevelTestQuiz";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";

import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return buildPageMetadata({
    title: dict.levelTest.title,
    description: dict.levelTest.meta,
    path: "/level-test",
  });
}

export default async function LevelTestPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.levelTest;

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{t.title}</p>
            <h1>{t.hero}</h1>
            <p>{t.lede}</p>
          </div>
        </section>
        <section className="section" data-reveal>
          <div className="wrap">
            <LevelTestQuiz dict={t} />
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
