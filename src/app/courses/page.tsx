import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { freeCourses } from "@/data/courses";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.courses.title, description: dict.courses.meta };
}

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const dbLessons = await prisma.freeLesson.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const courses =
    dbLessons.length > 0
      ? dbLessons.map((item) => ({
          slug: item.id,
          title: item.title,
          level: item.level,
          duration: item.duration,
          summary: item.summary,
          lessons: item.lessons
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        }))
      : freeCourses.map((course) => ({
          slug: course.slug,
          title: course.title[locale],
          level: course.level[locale],
          duration: course.duration[locale],
          summary: course.summary[locale],
          lessons: course.lessons[locale],
        }));

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
            {courses.map((course) => (
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
