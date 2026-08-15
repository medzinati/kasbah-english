import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { freeCourses } from "@/data/courses";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.courses.title, description: dict.courses.meta };
}

export default async function CoursesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{dict.courses.title}</p>
            <h1>{dict.courses.hero}</h1>
            <p>{dict.courses.lede}</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap course-list">
            {freeCourses.map((course) => (
              <article className="course-item" key={course.slug} id={course.slug}>
                <div className="course-meta">
                  <span>{course.level[locale]}</span>
                  <span>{course.duration[locale]}</span>
                </div>
                <h2>{course.title[locale]}</h2>
                <p>{course.summary[locale]}</p>
                <ol>
                  {course.lessons[locale].map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ol>
                <Link className="text-link" href="/apply">
                  {dict.courses.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
