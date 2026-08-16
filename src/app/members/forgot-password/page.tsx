import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.members.forgotTitle };
}

export default async function ForgotPasswordPage() {
  const session = await getSession();
  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/members");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{dict.nav.members}</p>
            <h1>{dict.members.forgotHero}</h1>
            <p>{dict.members.forgotLede}</p>
          </div>
        </section>
        <section className="section" data-reveal>
          <div className="wrap form-layout">
            <ForgotPasswordForm dict={dict.members} />
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
