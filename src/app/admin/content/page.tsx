import type { Metadata } from "next";
import { AdminContent } from "@/components/AdminContent";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "المحتوى المجاني" };
}

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const lessons = await prisma.freeLesson.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <AdminShell name={session.user.name} locale={locale} dict={dict} title="المحتوى المجاني">
      <p className="members-lede">تحكم في دروس الصفحة العامة `/courses`. إن لم تضف شيئًا، تبقى الدروس الافتراضية.</p>
      <AdminContent
        initial={lessons.map((item) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          level: item.level,
          duration: item.duration,
          lessons: item.lessons,
          published: item.published,
          sortOrder: item.sortOrder,
        }))}
      />
    </AdminShell>
  );
}
