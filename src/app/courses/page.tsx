import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { freeCourses } from "@/data/courses";

export const metadata: Metadata = {
  title: "دروس مجانية",
  description: "دروس إنجليزية مجانية من كاسباه إنجليش — عملية، ودودة، ومفتوحة للجميع.",
};

export default function CoursesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">دروس مجانية</p>
            <h1>تعلّم حاجة مفيدة اليوم</h1>
            <p>
              دروس قصيرة عامة تقدر تبدأ بيها دابا. ولما تكون مستعد لتدريب مباشر ودعم المجتمع، سجّل للانضمام لمساحة
              الأعضاء.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap course-list">
            {freeCourses.map((course) => (
              <article className="course-item" key={course.slug} id={course.slug}>
                <div className="course-meta">
                  <span>{course.level}</span>
                  <span>{course.duration}</span>
                </div>
                <h2>{course.title}</h2>
                <p>{course.summary}</p>
                <ol>
                  {course.lessons.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ol>
                <Link className="text-link" href="/apply">
                  عجبك؟ سجّل للانضمام للمجتمع ←
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
