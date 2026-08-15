import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MembersNav } from "@/components/MembersNav";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Members",
};

export const dynamic = "force-dynamic";

export default async function MembersHomePage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const [announcements, groups] = await Promise.all([
    prisma.announcement.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.discussionGroup.findMany({
      orderBy: { title: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} />

      <main className="wrap members-main">
        <p className="eyebrow">Members area</p>
        <h1>Welcome, {session.user.name?.split(" ")[0] || "member"}</h1>
        <p className="members-lede">
          Read community announcements, join discussion groups, and practice with other learners.
        </p>

        <div className="members-grid">
          <article>
            <h2>Community</h2>
            <p>Announcements and updates from Kasbah English.</p>
            <Link className="text-link" href="/members/community">
              Open community →
            </Link>
          </article>
          <article>
            <h2>Discussion groups</h2>
            <p>{groups.length} groups ready for conversation, exams, and career English.</p>
            <Link className="text-link" href="/members/groups">
              Browse groups →
            </Link>
          </article>
          <article>
            <h2>Meetings</h2>
            <p>Live sessions with Zoom links and a simple schedule.</p>
            <span className="soon">Coming in Phase 4</span>
          </article>
        </div>

        <section className="members-section">
          <div className="members-section-head">
            <h2>Latest announcements</h2>
            <Link className="text-link" href="/members/community">
              View all
            </Link>
          </div>
          {announcements.length === 0 ? (
            <p className="members-empty">No announcements yet.</p>
          ) : (
            <div className="feed-list">
              {announcements.map((item) => (
                <article key={item.id} className="feed-item">
                  <h3>{item.title}</h3>
                  <p className="feed-meta">
                    {item.author.name} ·{" "}
                    {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(item.createdAt)}
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
