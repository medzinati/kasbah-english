import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "التسجيل",
  description: "سجّل للانضمام لكاسباه إنجليش. الأعضاء المقبولون يدخلون للنقاشات والمجموعات ولقاءات زوم.",
};

export default function ApplyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">التسجيل</p>
            <h1>تعالا تتدرّب معانا</h1>
            <p>
              قول لينا شوية على مستواك وأهدافك. كنقراو كل طلب بعناية وكنستدعو المتعلمين المقبولين لدخول المجتمع.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap form-layout">
            <div className="form-aside">
              <h2>شنو غادي يوقع بعد؟</h2>
              <ol className="steps-list">
                <li>كتصيفط طلب التسجيل (كياخد دقايق قلال).</li>
                <li>كنراجعو مستواك وأهدافك ودافعك بعناية.</li>
                <li>إلا تقبلتي، غادي توصلك بيانات الدخول لمساحة الأعضاء.</li>
              </ol>
              <p className="form-note">
                الجميع يقدر يستكشف الموقع العام. والمجتمع الداخلي — النقاشات والمجموعات واللقاءات — خاص بالأعضاء
                المقبولين.
              </p>
            </div>
            <ApplyForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
