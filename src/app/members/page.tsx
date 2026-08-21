import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MembersHub } from "@/components/MembersHub";
import { MembersNav } from "@/components/MembersNav";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { canTeach } from "@/lib/roles";
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
  const now = new Date();
  const horizon = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  const [announcements, groups, posts, meetings] = await Promise.all([
    prisma.announcement.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.discussionGroup.findMany({
      orderBy: { title: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
    prisma.discussionPost.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        group: { select: { slug: true, title: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.meeting.findMany({
      where: { startsAt: { gte: horizon } },
      orderBy: { startsAt: "asc" },
      take: 5,
      include: {
        registrations: { select: { userId: true } },
      },
    }),
  ]);

  const feed = [
    ...announcements.map((item) => ({
      kind: "announcement" as const,
      id: item.id,
      title: item.title,
      body: item.body,
      authorName: item.author.name,
      createdAt: item.createdAt.toISOString(),
    })),
    ...posts.map((item) => ({
      kind: "post" as const,
      id: item.id,
      title: item.title,
      body: item.body,
      authorName: item.author.name,
      createdAt: item.createdAt.toISOString(),
      groupSlug: item.group.slug,
      groupTitle: item.group.title,
      replyCount: item._count.comments,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 25);

  const upcomingMeetings = meetings
    .filter((m) => {
      const end = m.startsAt.getTime() + m.durationMinutes * 60_000;
      return end >= now.getTime();
    })
    .map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      startsAt: m.startsAt.toISOString(),
      durationMinutes: m.durationMinutes,
      zoomUrl: m.zoomUrl,
      attendeeCount: m.registrations.length,
    }));

  const firstName = session.user.name?.split(" ")[0] || (locale === "ar" ? "عضو" : "member");

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} locale={locale} dict={dict} />

      <main className="wrap members-main members-main-hub">
        <MembersHub
          locale={locale}
          dict={dict}
          firstName={firstName}
          isStaff={canTeach(session.user.role)}
          groups={groups.map((g) => ({
            id: g.id,
            slug: g.slug,
            title: g.title,
            description: g.description,
            postCount: g._count.posts,
          }))}
          meetings={upcomingMeetings}
          pinnedAnnouncements={announcements.slice(0, 3).map((item) => ({
            id: item.id,
            title: item.title,
            body: item.body,
            authorName: item.author.name,
            createdAt: item.createdAt.toISOString(),
          }))}
          feed={feed}
        />
      </main>
    </div>
  );
}
