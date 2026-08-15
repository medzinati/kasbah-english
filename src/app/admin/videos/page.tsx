import type { Metadata } from "next";
import { AdminVideos } from "@/components/AdminVideos";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "الفيديوهات" };
}

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const videos = await prisma.video.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell name={session.user.name} locale={locale} dict={dict} title="الفيديوهات">
      <p className="members-lede">أضف فيديوهات تعليمية تظهر للأعضاء في مساحة الأعضاء.</p>
      <AdminVideos
        initial={videos.map((v) => ({
          id: v.id,
          title: v.title,
          description: v.description,
          url: v.url,
          published: v.published,
        }))}
      />
    </AdminShell>
  );
}
