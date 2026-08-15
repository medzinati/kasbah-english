import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع كاسباه إنجليش لأي سؤال حول الدروس المجانية أو التسجيل أو مجتمع الأعضاء.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">تواصل معنا</p>
            <h1>فرحانين نساعدوك</h1>
            <p>أسئلة حول التسجيل، الدروس المجانية، المستوى، أو المجتمع؟ صيفط رسالة — كنقراو كل وحدة.</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>بغيتي بالإيميل؟</h2>
              <p>
                اكتب لينا على{" "}
                <a className="text-link" href="mailto:mohamed.ketrani.zinati@gmail.com">
                  mohamed.ketrani.zinati@gmail.com
                </a>
              </p>
              <p className="form-note">غالبًا كنردّو خلال يوم إلى يومين عمل. باش التسجيل، استعمل صفحة التسجيل.</p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
