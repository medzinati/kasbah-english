import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { freeCourses } from "@/data/courses";

export const metadata: Metadata = {
  title: "Free courses",
  description: "Free English starter courses from Kasbah English — practical, friendly, and open to everyone.",
};

export default function CoursesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">Free courses</p>
            <h1>Learn something useful today</h1>
            <p>
              Short public lessons you can start now. When you’re ready for live practice and community support, apply to
              join the members area.
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
                  Like this? Apply to join the community →
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
