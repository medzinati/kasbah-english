import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.members.loginTitle };
}

export default async function MembersLoginPage() {
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
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{dict.nav.members}</p>
            <h1>{dict.members.loginHero}</h1>
            <p>{dict.members.loginLede}</p>
          </div>
        </section>
        <section className="section">
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>{dict.members.notMember}</h2>
              <p className="form-note">{dict.members.notMemberNote}</p>
              <Link className="text-link" href="/apply">
                {dict.members.goApply}
              </Link>
            </div>
            <LoginForm dict={dict.members} />
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
