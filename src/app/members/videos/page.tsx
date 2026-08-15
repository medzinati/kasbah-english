import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MembersNav } from "@/components/MembersNav";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "الفيديوهات" };
}

export const dynamic = "force-dynamic";

export default async function MembersVideosPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const videos = await prisma.video.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} locale={locale} dict={dict} />
      <main className="wrap members-main">
        <p className="eyebrow">تعلّم</p>
        <h1>الفيديوهات</h1>
        <p className="members-lede">محتوى فيديو منشور من الإدارة للأعضاء.</p>

        <div className="feed-list">
          {videos.length === 0 ? (
            <p className="members-empty">لا توجد فيديوهات منشورة بعد.</p>
          ) : (
            videos.map((video) => (
              <article key={video.id} className="feed-item">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <p className="feed-meta">
                  <a href={video.url} target="_blank" rel="noreferrer" dir="ltr">
                    مشاهدة الفيديو
                  </a>
                </p>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
