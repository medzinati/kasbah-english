import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MembersNav } from "@/components/MembersNav";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.members.area };
}

export const dynamic = "force-dynamic";

export default async function MembersHomePage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

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

  const firstName = session.user.name?.split(" ")[0] || (locale === "ar" ? "عضو" : "member");

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} locale={locale} dict={dict} />

      <main className="wrap members-main">
        <p className="eyebrow">{dict.members.area}</p>
        <h1>
          {dict.members.welcome} {firstName}
        </h1>
        <p className="members-lede">{dict.members.welcomeLede}</p>

        <div className="members-grid">
          <article>
            <h2>{dict.members.community}</h2>
            <p>{dict.members.announcementsLede}</p>
            <Link className="text-link" href="/members/community">
              {dict.members.openCommunity}
            </Link>
          </article>
          <article>
            <h2>{dict.members.groups}</h2>
            <p>
              {groups.length} {dict.members.groupsReady}
            </p>
            <Link className="text-link" href="/members/groups">
              {dict.members.browseGroups}
            </Link>
          </article>
          <article>
            <h2>{dict.members.meetings}</h2>
            <p>
              {upcomingCount
                ? `${upcomingCount} ${dict.members.sessionsOnSchedule}`
                : dict.members.liveZoom}
            </p>
            <Link className="text-link" href="/members/meetings">
              {dict.members.viewSchedule}
            </Link>
          </article>
        </div>

        <section className="members-section">
          <div className="members-section-head">
            <h2>{dict.members.latestAnnouncements}</h2>
            <Link className="text-link" href="/members/community">
              {dict.members.viewAll}
            </Link>
          </div>
          {announcements.length === 0 ? (
            <p className="members-empty">{dict.members.noAnnouncements}</p>
          ) : (
            <div className="feed-list">
              {announcements.map((item) => (
                <article key={item.id} className="feed-item">
                  <h3>{item.title}</h3>
                  <p className="feed-meta">
                    {item.author.name} ·{" "}
                    {new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" }).format(
                      item.createdAt,
                    )}
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
