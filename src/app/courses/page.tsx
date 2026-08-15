import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { freeCourses } from "@/data/courses";

export const metadata: Metadata = {
  title: "Free courses",
  description: "Free English starter courses from Kasbah English — no account required.",
};

export default function CoursesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">Free courses</p>
            <h1>Start learning before you apply</h1>
            <p>Short public lessons you can use today. The full community opens after acceptance.</p>
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
                <a className="text-link" href="/apply">
                  Ready for the community? Apply →
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
