import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocale } from "@/i18n/get-locale";
import { getReviewPhotos, getSiteDictionary } from "@/lib/site-content";

export default async function Home() {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  const h = dict.home;
  const photos = await getReviewPhotos();

  const reviews = h.reviews.map((item, index) => ({
    ...item,
    photo: photos[index] || photos[0] || "/images/reviews/1.png",
  }));

  return (
    <>
      <SiteHeader variant="hero" locale={locale} dict={dict} />

      <main id="top">
        <section className="hero" aria-label={dict.brand}>
          <div className="hero-media" aria-hidden="true">
            <Image
              src="/images/saudi-learners-hero.png"
              alt=""
              fill
              priority
              quality={72}
              sizes="(max-width: 800px) 100vw, 1400px"
            />
            <div className="hero-shade" />
            <div className="hero-grain" aria-hidden="true" />
          </div>

          <div className="wrap hero-content">
            <h1 className="brand brand-logo-heading">
              <BrandLogo size="hero" alt={dict.brand} priority />
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
            <p className="hero-level-link">
              <Link href="/level-test">{h.ctaLevel}</Link>
            </p>
          </div>
        </section>

        <section className="section why-us" data-reveal>
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{h.whyEyebrow}</p>
              <h2>{h.whyTitle}</h2>
              <p>{h.whyText}</p>
            </div>
            <ul className="why-list">
              {h.why.map((item) => (
                <li key={item.title} data-reveal>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section reviews" data-reveal>
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{h.whatEyebrow}</p>
              <h2>{h.whatTitle}</h2>
              <p>{h.whatText}</p>
            </div>

            <div className="review-list">
              {reviews.map((item) => (
                <article className="review" key={item.name} data-reveal>
                  <Image
                    className="review-photo"
                    src={item.photo}
                    alt={item.name}
                    width={88}
                    height={88}
                  />
                  <div>
                    <div className="review-stars" aria-label={locale === "ar" ? "تقييم ٥ من ٥" : "5 out of 5 stars"}>
                      <span aria-hidden="true">★★★★★</span>
                    </div>
                    <p className="review-quote">“{item.quote}”</p>
                    <p className="review-meta">
                      <strong>{item.name}</strong>
                      <span>{item.country}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section trust-section" data-reveal>
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{h.trustEyebrow}</p>
              <h2>{h.trustTitle}</h2>
              <p>{h.trustText}</p>
            </div>
            <ul className="trust-list">
              {h.trust.map((item) => (
                <li key={item.title} data-reveal>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section method" data-reveal>
          <div className="wrap method-grid">
            <div data-reveal="left">
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

            <div className="method-visual" data-reveal="right">
              <Image
                src="/images/saudi-learners-group.png"
                alt={h.visualAlt}
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
              />
            </div>
          </div>
        </section>

        <section className="section audience" data-reveal>
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{h.whoEyebrow}</p>
              <h2>{h.whoTitle}</h2>
              <p>{h.whoText}</p>
            </div>
            <div className="audience-split">
              <article data-reveal="left">
                <h3>{h.morocco}</h3>
                <p>{h.moroccoText}</p>
              </article>
              <article data-reveal="right">
                <h3>{h.world}</h3>
                <p>{h.worldText}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section faq-section" data-reveal>
          <div className="wrap faq-inner">
            <div className="section-head">
              <p className="eyebrow">{h.faqEyebrow}</p>
              <h2>{h.faqTitle}</h2>
            </div>
            <div className="faq-list">
              {h.faq.map((item) => (
                <details key={item.q} className="faq-item" data-reveal>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section final-cta" data-reveal="fade">
          <div className="wrap">
            <h2>{h.finalTitle}</h2>
            <p>{h.finalText}</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/apply">
                {h.ctaApply}
              </Link>
              <Link className="btn btn-ghost dark" href="/pricing">
                {h.ctaPricing}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter dict={dict} />
    </>
  );
}
