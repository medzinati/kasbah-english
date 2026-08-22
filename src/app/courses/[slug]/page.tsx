import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { freeCourses, getFreeCourseBySlug } from "@/data/courses";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/SiteJsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return freeCourses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getFreeCourseBySlug(slug);
  const locale = await getLocale();
  if (!course) return {};
  return buildPageMetadata({
    title: course.title[locale],
    description: course.summary[locale],
    path: `/courses/${slug}`,
    image: course.image,
    imageAlt: course.imageAlt[locale],
  });
}

export default async function FreeCoursePage({ params }: Props) {
  const { slug } = await params;
  const course = getFreeCourseBySlug(slug);
  if (!course) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <CourseJsonLd
        name={course.title[locale]}
        description={course.summary[locale]}
        url={`/courses/${slug}`}
        image={course.image}
        locale={locale}
        brand={dict.brand}
      />
      <BreadcrumbJsonLd
        items={[
          { name: dict.brand, path: "/" },
          { name: dict.courses.title, path: "/courses" },
          { name: course.title[locale], path: `/courses/${slug}` },
        ]}
      />
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">
              <Link href="/courses">{dict.courses.backToCourses}</Link>
            </p>
            <h1>{course.title[locale]}</h1>
            <p>{course.summary[locale]}</p>
            <p className="courses-free-note">
              {course.level[locale]} · {course.duration[locale]}
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap course-lesson-stack">
            <div className="course-lesson-media" data-reveal>
              <Image
                src={course.image}
                alt={course.imageAlt[locale]}
                width={1200}
                height={675}
                sizes="(max-width: 800px) 100vw, 800px"
                quality={75}
                priority
              />
            </div>

            {course.modules.map((module, index) => (
              <article className="course-lesson" key={module.title.en} data-reveal id={`lesson-${index + 1}`}>
                <header className="course-lesson-head">
                  <p className="eyebrow">
                    {locale === "ar" ? `الدرس ${index + 1}` : `Lesson ${index + 1}`} · {module.minutes[locale]}
                  </p>
                  <h2>{module.title[locale]}</h2>
                </header>
                {module.body[locale].map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
                <div className="course-lesson-box">
                  <h3>{dict.courses.phrases}</h3>
                  <ul>
                    {module.phrases[locale].map((phrase) => (
                      <li key={phrase} dir="ltr">
                        {phrase}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="course-lesson-practice">
                  <h3>{dict.courses.practice}</h3>
                  <p>{module.practice[locale]}</p>
                </div>
              </article>
            ))}

            <div className="course-lesson-cta" data-reveal>
              <Link className="btn btn-primary" href="/apply">
                {dict.courses.cta}
              </Link>
              <Link className="btn btn-ghost dark" href="/pricing">
                {dict.nav.pricing}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
