import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";

export default async function Home() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const h = dict.home;

  const highlights = [
    { title: h.h1, text: h.h1text },
    { title: h.h2, text: h.h2text },
    { title: h.h3, text: h.h3text },
  ];

  return (
    <>
      <SiteHeader variant="hero" locale={locale} dict={dict} />

      <main id="top">
        <section className="hero" aria-label={dict.brand}>
          <div className="hero-media" aria-hidden="true">
            <Image
              src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=2400&q=80"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <div className="hero-shade" />
            <div className="hero-grain" aria-hidden="true" />
          </div>

          <div className="wrap hero-content">
            <h1 className="brand">
              {dict.brandShort} <em>{dict.brandAccent}</em>
            </h1>
            <p className="headline">{h.headline}</p>
            <p className="lede">{h.lede}</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/apply">
                {h.ctaApply}
              </Link>
              <Link className="btn btn-ghost" href="/courses">
                {h.ctaCourses}
              </Link>
            </div>
          </div>
        </section>

        <section className="section programs">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{h.whatEyebrow}</p>
              <h2>{h.whatTitle}</h2>
              <p>{h.whatText}</p>
            </div>

            <div className="program-list">
              {highlights.map((item, index) => (
                <article className="program" key={item.title}>
                  <span className="program-num">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section method">
          <div className="wrap method-grid">
            <div>
              <div className="section-head">
                <p className="eyebrow">{h.howEyebrow}</p>
                <h2>{h.howTitle}</h2>
                <p>{h.howText}</p>
              </div>
              <div className="method-points">
                <article>
                  <h3>{h.step1}</h3>
                  <p>{h.step1text}</p>
                </article>
                <article>
                  <h3>{h.step2}</h3>
                  <p>{h.step2text}</p>
                </article>
                <article>
                  <h3>{h.step3}</h3>
                  <p>{h.step3text}</p>
                </article>
              </div>
            </div>

            <div className="method-visual">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80"
                alt={h.visualAlt}
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
              />
            </div>
          </div>
        </section>

        <section className="section audience">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{h.whoEyebrow}</p>
              <h2>{h.whoTitle}</h2>
              <p>{h.whoText}</p>
            </div>
            <div className="audience-split">
              <article>
                <h3>{h.morocco}</h3>
                <p>{h.moroccoText}</p>
              </article>
              <article>
                <h3>{h.world}</h3>
                <p>{h.worldText}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section final-cta">
          <div className="wrap">
            <h2>{h.finalTitle}</h2>
            <p>{h.finalText}</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/apply">
                {dict.nav.applyNow}
              </Link>
              <Link className="btn btn-ghost dark" href="/contact">
                {h.askQuestion}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter dict={dict} />
    </>
  );
}
