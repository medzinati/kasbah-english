import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { getSession } from "@/lib/session";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.members.resetTitle };
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const session = await getSession();
  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/members");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const params = await searchParams;
  const token = params.token?.trim() || "";

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{dict.nav.members}</p>
            <h1>{dict.members.resetHero}</h1>
            <p>{dict.members.resetLede}</p>
          </div>
        </section>
        <section className="section" data-reveal>
          <div className="wrap form-layout">
            <ResetPasswordForm dict={dict.members} token={token} />
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
