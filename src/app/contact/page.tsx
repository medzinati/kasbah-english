import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Kasbah English with questions about free courses, applications, or the members community.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">Contact</p>
            <h1>We’re happy to help</h1>
            <p>Questions about applying, free courses, levels, or the community? Send a message — we read every one.</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>Prefer email?</h2>
              <p>
                Write to{" "}
                <a className="text-link" href="mailto:mohamed.ketrani.zinati@gmail.com">
                  mohamed.ketrani.zinati@gmail.com
                </a>
              </p>
              <p className="form-note">We usually reply within 1–2 business days. For applications, use the Apply page.</p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
