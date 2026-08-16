import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MembersNav } from "@/components/MembersNav";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.members.videosHero };
}

export const dynamic = "force-dynamic";

export default async function MembersVideosPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const m = dict.members;

  const videos = await prisma.video.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} locale={locale} dict={dict} />
      <main className="wrap members-main">
        <p className="eyebrow">{m.videosEyebrow}</p>
        <h1>{m.videosHero}</h1>
        <p className="members-lede">{m.videosLede}</p>

        <div className="feed-list">
          {videos.length === 0 ? (
            <p className="members-empty">{m.videosEmpty}</p>
          ) : (
            videos.map((video) => (
              <article key={video.id} className="feed-item">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <p className="feed-meta">
                  <a href={video.url} target="_blank" rel="noreferrer" dir="ltr">
                    {m.watchVideo}
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
