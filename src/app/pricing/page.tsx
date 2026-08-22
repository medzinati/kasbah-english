import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocale } from "@/i18n/get-locale";
import { getSiteDictionary } from "@/lib/site-content";

import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  return buildPageMetadata({
    title: dict.pricing.title,
    description: dict.pricing.meta,
    path: "/pricing",
  });
}

const monthsByPlan: Record<string, number> = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "12m": 12,
};

export default async function PricingPage() {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  const p = dict.pricing;

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{p.title}</p>
            <h1>{p.hero}</h1>
            <p>{p.lede}</p>
          </div>
        </section>

        <section className="section pricing-section" data-reveal>
          <div className="wrap">
            <ul className="pricing-includes">
              <li className="pricing-includes-title">{p.includesTitle}</li>
              {p.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="pricing-trust" data-reveal>
              <h2 className="pricing-trust-title">{p.trustTitle}</h2>
              <ul>
                {p.trustItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="pricing-list">
              {p.plans.map((plan) => {
                const months = monthsByPlan[plan.id] || 1;
                const monthlyRaw = Number(plan.price) / months;
                const monthly =
                  Math.abs(monthlyRaw - Math.round(monthlyRaw)) < 0.05
                    ? String(Math.round(monthlyRaw))
                    : monthlyRaw.toFixed(1);
                const isPopular = plan.badge === "popular";
                const isValue = plan.badge === "value";

                return (
                  <article
                    key={plan.id}
                    data-reveal
                    className={`pricing-plan${isPopular ? " is-featured" : ""}${isValue ? " is-value" : ""}`}
                  >
                    <div className="pricing-plan-top">
                      <div>
                        {isPopular ? <p className="pricing-badge">{p.popular}</p> : null}
                        {isValue ? <p className="pricing-badge pricing-badge-value">{p.bestValue}</p> : null}
                        <h2>{plan.name}</h2>
                        <p className="pricing-duration">{plan.duration}</p>
                      </div>
                      <div className="pricing-amount">
                        <span className="pricing-price">
                          {plan.price}
                          <small> {p.currency}</small>
                        </span>
                        <span className="pricing-monthly">
                          {p.perMonth} {monthly} {p.currency}
                          {locale === "en" ? p.monthUnit : ` / ${p.monthUnit}`}
                        </span>
                      </div>
                    </div>
                    <p className="pricing-blurb">{plan.blurb}</p>
                    <Link className="btn btn-primary" href={`/apply?plan=${plan.id}`}>
                      {p.cta}
                    </Link>
                  </article>
                );
              })}
            </div>

            <p className="pricing-note">{p.note}</p>
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
