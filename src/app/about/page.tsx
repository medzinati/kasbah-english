import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { getWhatsAppHref, SITE_EMAIL } from "@/lib/site-contact";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.about.title, description: dict.about.meta };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const a = dict.about;

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{a.title}</p>
            <h1>{a.hero}</h1>
            <p>{a.lede}</p>
          </div>
        </section>

        <section className="section about-story">
          <div className="wrap about-story-inner">
            <p className="about-lead">{a.story1}</p>
            <p>{a.story2}</p>
            <p>{a.story3}</p>
          </div>
        </section>

        <section className="section about-values">
          <div className="wrap">
            <header className="section-head">
              <p className="eyebrow">{a.valuesEyebrow}</p>
              <h2>{a.valuesTitle}</h2>
            </header>
            <ul className="about-value-list">
              {a.values.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section final-cta">
          <div className="wrap">
            <h2>{a.ctaTitle}</h2>
            <p>{a.ctaText}</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/apply">
                {dict.nav.applyNow}
              </Link>
              <a
                className="btn btn-ghost dark"
                href={getWhatsAppHref(dict.whatsapp.prefill)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.whatsapp.label}
              </a>
            </div>
            <p className="about-email">
              {a.emailLabel}{" "}
              <a className="text-link" href={`mailto:${SITE_EMAIL}`}>
                {SITE_EMAIL}
              </a>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
