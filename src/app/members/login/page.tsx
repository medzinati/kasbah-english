import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Members login",
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
            <p className="eyebrow">Members</p>
            <h1>Welcome back</h1>
            <p>Sign in to your Kasbah English community — discussions, groups, and live meetings await.</p>
          </div>
        </section>
        <section className="section">
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>Not a member yet?</h2>
              <p className="form-note">
                That’s okay — start with a free course, then apply. After we accept you, you’ll receive login details.
              </p>
              <Link className="text-link" href="/apply">
                Go to apply →
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
