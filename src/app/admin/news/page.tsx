import type { Metadata } from "next";
import { AdminNews } from "@/components/AdminNews";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "الأخبار" };
}

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const posts = await prisma.newsPost.findMany({ orderBy: { date: "desc" } });

  return (
    <AdminShell name={session.user.name} locale={locale} dict={dict} title="الأخبار والمقالات">
      <p className="members-lede">أضف مقالات طويلة مع صورة. في صفحة الأخبار يظهر ملخص قصير فقط.</p>
      <AdminNews
        initial={posts.map((item) => ({
          id: item.id,
          slug: item.slug,
          titleAr: item.titleAr,
          published: item.published,
          imageUrl: item.imageUrl,
          date: item.date.toISOString(),
        }))}
      />
    </AdminShell>
  );
}
