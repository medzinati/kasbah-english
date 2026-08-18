import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocale } from "@/i18n/get-locale";
import { getWhatsAppHref, getSiteContact } from "@/lib/site-contact";
import { getSiteDictionary } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  return { title: dict.about.title, description: dict.about.meta };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  const a = dict.about;
  const contact = await getSiteContact();
  const photoAlt =
    locale === "ar"
      ? "متعلمون في الخليج يتدرّبون على الإنجليزية معًا"
      : "Gulf learners practicing English together";

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{a.title}</p>
            <h1>{a.hero}</h1>
            <p>{a.lede}</p>
          </div>
        </section>

        <section className="about-visual" data-reveal="fade" aria-label={photoAlt}>
          <div className="about-visual-media">
            <Image
              src="/images/saudi-learners-group.png"
              alt={photoAlt}
              fill
              priority
              sizes="100vw"
              quality={75}
            />
            <div className="about-visual-shade" aria-hidden="true" />
          </div>
        </section>

        <section className="section about-story" data-reveal>
          <div className="wrap about-story-inner">
            <p className="about-lead">{a.story1}</p>
            <p>{a.story2}</p>
            <p>{a.story3}</p>
          </div>
        </section>

        <section className="section about-values" data-reveal>
          <div className="wrap">
            <header className="section-head">
              <p className="eyebrow">{a.valuesEyebrow}</p>
              <h2>{a.valuesTitle}</h2>
            </header>
            <ul className="about-value-list">
              {a.values.map((item) => (
                <li key={item.title} data-reveal>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section final-cta" data-reveal="fade">
          <div className="wrap">
            <h2>{a.ctaTitle}</h2>
            <p>{a.ctaText}</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/apply">
                {dict.nav.applyNow}
              </Link>
              <a
                className="btn btn-ghost dark"
                href={getWhatsAppHref(dict.whatsapp.prefill, contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.whatsapp.label}
              </a>
            </div>
            <p className="about-email">
              {a.emailLabel}{" "}
              <a className="text-link" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
