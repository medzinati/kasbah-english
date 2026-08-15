import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.contact.title, description: dict.contact.meta };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{dict.contact.title}</p>
            <h1>{dict.contact.hero}</h1>
            <p>{dict.contact.lede}</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>{dict.contact.preferEmail}</h2>
              <p>
                {dict.contact.writeTo}{" "}
                <a className="text-link" href="mailto:mohamed.ketrani.zinati@gmail.com">
                  mohamed.ketrani.zinati@gmail.com
                </a>
              </p>
              <p className="form-note">{dict.contact.note}</p>
            </div>
            <ContactForm dict={dict.contact} />
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
