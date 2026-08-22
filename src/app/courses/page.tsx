import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { freeCourses } from "@/data/courses";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";

import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return buildPageMetadata({
    title: dict.courses.title,
    description: dict.courses.meta,
    path: "/courses",
  });
}

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const dbLessons = await prisma.freeLesson.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const staticCourses = freeCourses.map((course) => ({
    slug: course.slug,
    title: course.title[locale],
    level: course.level[locale],
    duration: course.duration[locale],
    summary: course.summary[locale],
    image: course.image,
    imageAlt: course.imageAlt[locale],
    lessons: course.lessons[locale],
    href: `/courses/${course.slug}`,
    playable: true,
  }));

  const adminCourses = dbLessons.map((item) => ({
    slug: item.id,
    title: item.title,
    level: item.level,
    duration: item.duration,
    summary: item.summary,
    image: item.imageUrl || "/images/courses/everyday.png",
    imageAlt: item.title,
    lessons: item.lessons
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    href: "/apply",
    playable: false,
  }));

  const weeklyTip = {
    slug: "weekly-tip",
    title: locale === "ar" ? "عبارة الأسبوع: I’m looking forward to…" : "Phrase of the week: I’m looking forward to…",
    level: locale === "ar" ? "متوسط" : "Intermediate",
    duration: locale === "ar" ? "٢ دقيقة" : "2 minutes",
    summary:
      locale === "ar"
        ? "درس قصير مجاني لهذا الأسبوع — افتح المقالة، اقرأ المثال، واكتب جملتين اليوم."
        : "This week’s free micro-lesson — open the article, read the example, and write two sentences today.",
    image: "/images/news/free-lessons.png",
    imageAlt: locale === "ar" ? "عبارة الأسبوع" : "Phrase of the week",
    lessons:
      locale === "ar"
        ? ["قاعدة to + -ing", "مثال للاجتماعات", "تمرين جملتين"]
        : ["to + -ing rule", "Meeting example", "Two-sentence practice"],
    href: "/news/phrase-of-the-week-looking-forward",
    playable: true,
  };

  const courses = [weeklyTip, ...staticCourses, ...adminCourses];

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{dict.courses.title}</p>
            <h1>{dict.courses.hero}</h1>
            <p>{dict.courses.lede}</p>
            <p className="courses-free-note">{dict.courses.freeNote}</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap course-list">
            {courses.map((course) => (
              <article className="course-item" key={course.slug} id={course.slug} data-reveal>
                <div className="course-media">
                  <Image
                    src={course.image}
                    alt={course.imageAlt}
                    width={1200}
                    height={675}
                    sizes="(max-width: 800px) 100vw, 720px"
                    quality={75}
                  />
                </div>
                <div className="course-copy">
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
                  <div className="course-actions">
                    <Link className="btn btn-primary" href={course.href}>
                      {course.playable ? dict.courses.openLesson : dict.courses.cta}
                    </Link>
                    {course.playable ? (
                      <Link className="text-link" href="/apply">
                        {dict.courses.cta}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
