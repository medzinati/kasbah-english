import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MembersNav } from "@/components/MembersNav";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "مساحة الأعضاء",
};

export const dynamic = "force-dynamic";

export default async function MembersHomePage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const [announcements, groups, upcomingCount] = await Promise.all([
    prisma.announcement.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.discussionGroup.findMany({
      orderBy: { title: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
    prisma.meeting.count({
      where: { startsAt: { gte: new Date(Date.now() - 3 * 60 * 60 * 1000) } },
    }),
  ]);

  const firstName = session.user.name?.split(" ")[0] || "عضو";

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} />

      <main className="wrap members-main">
        <p className="eyebrow">مساحة الأعضاء</p>
        <h1>أهلًا {firstName}</h1>
        <p className="members-lede">
          اقرأ الإعلانات، انضم لمجموعات النقاش، واحضر لقاءات زوم المباشرة مع المجتمع.
        </p>

        <div className="members-grid">
          <article>
            <h2>المجتمع</h2>
            <p>إعلانات وتحديثات من كاسباه إنجليش.</p>
            <Link className="text-link" href="/members/community">
              افتح المجتمع ←
            </Link>
          </article>
          <article>
            <h2>مجموعات النقاش</h2>
            <p>{groups.length} مجموعات جاهزة للمحادثة، الامتحانات، وإنجليزية العمل.</p>
            <Link className="text-link" href="/members/groups">
              تصفّح المجموعات ←
            </Link>
          </article>
          <article>
            <h2>اللقاءات</h2>
            <p>
              {upcomingCount
                ? `${upcomingCount} جلسة في الجدول.`
                : "حصص زوم مباشرة مع المجتمع."}
            </p>
            <Link className="text-link" href="/members/meetings">
              شوف الجدول ←
            </Link>
          </article>
        </div>

        <section className="members-section">
          <div className="members-section-head">
            <h2>آخر الإعلانات</h2>
            <Link className="text-link" href="/members/community">
              عرض الكل
            </Link>
          </div>
          {announcements.length === 0 ? (
            <p className="members-empty">ما كاين حتى إعلان دابا.</p>
          ) : (
            <div className="feed-list">
              {announcements.map((item) => (
                <article key={item.id} className="feed-item">
                  <h3>{item.title}</h3>
                  <p className="feed-meta">
                    {item.author.name} ·{" "}
                    {new Intl.DateTimeFormat("ar", { dateStyle: "medium" }).format(item.createdAt)}
                  </p>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
