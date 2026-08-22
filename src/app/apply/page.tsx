import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocale } from "@/i18n/get-locale";
import { getSiteDictionary } from "@/lib/site-content";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  searchParams: Promise<{ plan?: string; level?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  return buildPageMetadata({
    title: dict.apply.title,
    description: dict.apply.meta,
    path: "/apply",
  });
}

export default async function ApplyPage({ searchParams }: Props) {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  const params = await searchParams;
  const initialPlan = params.plan?.trim() || "";
  const initialLevel = params.level?.trim() || "";

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{dict.apply.title}</p>
            <h1>{dict.apply.hero}</h1>
            <p>{dict.apply.lede}</p>
          </div>
        </section>

        <section className="section" data-reveal>
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>{dict.apply.nextTitle}</h2>
              <ol className="steps-list">
                <li>{dict.apply.step1}</li>
                <li>{dict.apply.step2}</li>
                <li>{dict.apply.step3}</li>
              </ol>
              <p className="form-note">{dict.apply.note}</p>
            </div>
            <ApplyForm
              dict={dict.apply}
              plans={dict.pricing.plans}
              currency={dict.pricing.currency}
              initialPlan={initialPlan}
              initialLevel={initialLevel}
            />
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
