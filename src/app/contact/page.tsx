import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Kasbah English for questions about programs, applications, and the community.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">Contact</p>
            <h1>Talk to us</h1>
            <p>Questions about applying, free courses, or the members community — send a message.</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>Other ways to reach us</h2>
              <p>
                Prefer email? Write to{" "}
                <a className="text-link" href="mailto:mohamed.ketrani.zinati@gmail.com">
                  mohamed.ketrani.zinati@gmail.com
                </a>
              </p>
              <p className="form-note">We usually reply within 1–2 business days.</p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
