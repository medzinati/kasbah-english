import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { MembersNav } from "@/components/MembersNav";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "المجتمع",
};

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} />
      <main className="wrap members-main">
        <p className="eyebrow">المجتمع</p>
        <h1>الإعلانات</h1>
        <p className="members-lede">أخبار وتحديثات للأعضاء المقبولين.</p>

        {session.user.role === "ADMIN" ? <AnnouncementForm /> : null}

        <div className="feed-list">
          {announcements.length === 0 ? (
            <p className="members-empty">ما كاين حتى إعلان دابا.</p>
          ) : (
            announcements.map((item) => (
              <article key={item.id} className="feed-item">
                <h3>{item.title}</h3>
                <p className="feed-meta">
                  {item.author.name} ·{" "}
                  {new Intl.DateTimeFormat("ar", {
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
