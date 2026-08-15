import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { MembersNav } from "@/components/MembersNav";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.members.community };
}

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} locale={locale} dict={dict} />
      <main className="wrap members-main">
        <p className="eyebrow">{dict.members.community}</p>
        <h1>{dict.members.announcements}</h1>
        <p className="members-lede">{dict.members.announcementsLede}</p>

        {session.user.role === "ADMIN" ? <AnnouncementForm /> : null}

        <div className="feed-list">
          {announcements.length === 0 ? (
            <p className="members-empty">{dict.members.noAnnouncements}</p>
          ) : (
            announcements.map((item) => (
              <article key={item.id} className="feed-item">
                <h3>{item.title}</h3>
                <p className="feed-meta">
                  {item.author.name} ·{" "}
                  {new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(item.createdAt)}
                </p>
                <p>{item.body}</p>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
