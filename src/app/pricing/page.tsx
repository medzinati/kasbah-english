import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.pricing.title, description: dict.pricing.meta };
}

const monthsByPlan: Record<string, number> = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "12m": 12,
  "36m": 36,
};

export default async function PricingPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.pricing;

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{p.title}</p>
            <h1>{p.hero}</h1>
            <p>{p.lede}</p>
          </div>
        </section>

        <section className="section pricing-section">
          <div className="wrap">
            <ul className="pricing-includes">
              <li className="pricing-includes-title">{p.includesTitle}</li>
              {p.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="pricing-list">
              {p.plans.map((plan) => {
                const months = monthsByPlan[plan.id] || 1;
                const monthlyRaw = Number(plan.price) / months;
                const monthly =
                  Math.abs(monthlyRaw - Math.round(monthlyRaw)) < 0.05
                    ? String(Math.round(monthlyRaw))
                    : monthlyRaw.toFixed(1);
                const featured = plan.featured;

                return (
                  <article key={plan.id} className={`pricing-plan${featured ? " is-featured" : ""}`}>
                    <div className="pricing-plan-top">
                      <div>
                        {featured ? <p className="pricing-badge">{p.popular}</p> : null}
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
