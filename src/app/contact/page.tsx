import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocale } from "@/i18n/get-locale";
import { getWhatsAppHref, getSiteContact } from "@/lib/site-contact";
import { getSiteDictionary } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  return { title: dict.contact.title, description: dict.contact.meta };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const dict = await getSiteDictionary(locale);
  const contact = await getSiteContact();

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{dict.contact.title}</p>
            <h1>{dict.contact.hero}</h1>
            <p>{dict.contact.lede}</p>
          </div>
        </section>

        <section className="section" data-reveal>
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>{dict.contact.preferEmail}</h2>
              <p>
                {dict.contact.writeTo}{" "}
                <a className="text-link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </p>
              <p>
                {dict.whatsapp.label}:{" "}
                <a
                  className="text-link"
                  href={getWhatsAppHref(dict.whatsapp.prefill, contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dict.whatsapp.chat}
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
