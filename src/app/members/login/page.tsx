import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "دخول الأعضاء",
};

export default async function MembersLoginPage() {
  const session = await getSession();
  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/members");
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">الأعضاء</p>
            <h1>مرحبًا بعودتك</h1>
            <p>ادخل لمجتمع كاسباه إنجليش — نقاشات، مجموعات، ولقاءات مباشرة كتسناك.</p>
          </div>
        </section>
        <section className="section">
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>ما زلت مش عضو؟</h2>
              <p className="form-note">
                ماشي مشكل — ابدأ بدرس مجاني، ومن بعد سجّل. بعد القبول غادي توصلك بيانات الدخول.
              </p>
              <Link className="text-link" href="/apply">
                اذهب للتسجيل ←
              </Link>
            </div>
            <LoginForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
