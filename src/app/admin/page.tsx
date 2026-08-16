import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "لوحة التحكم" };
}

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [pendingApps, members, videos, lessons, upcomingMeetings, announcements] = await Promise.all([
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.video.count(),
    prisma.freeLesson.count(),
    prisma.meeting.count({ where: { startsAt: { gte: new Date() } } }),
    prisma.announcement.count(),
  ]);

  const cards = [
    { href: "/admin/site", label: "محتوى الموقع", value: "CMS" },
    { href: "/admin/applications", label: "طلبات بانتظار المراجعة", value: pendingApps },
    { href: "/admin/members", label: "الأعضاء", value: members },
    { href: "/admin/videos", label: "الفيديوهات", value: videos },
    { href: "/admin/content", label: "دروس مجانية", value: lessons },
    { href: "/admin/meetings", label: "لقاءات قادمة", value: upcomingMeetings },
    { href: "/admin/community", label: "إعلانات", value: announcements },
  ];

  return (
    <AdminShell name={session.user.name} locale={locale} dict={dict} title="لوحة التحكم">
      <p className="members-lede">تحكم كامل: محتوى الموقع العام، الأعضاء، الأخبار، الفيديوهات، واللقاءات.</p>

      <div className="admin-stats">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="admin-stat">
            <strong>{card.value}</strong>
            <span>{card.label}</span>
          </Link>
        ))}
      </div>

      <section className="members-section">
        <h2>اختصارات سريعة</h2>
        <div className="admin-quick">
          <Link className="btn btn-primary" href="/admin/site">
            تعديل محتوى الموقع
          </Link>
          <Link className="btn btn-ghost dark" href="/admin/videos">
            إضافة فيديو
          </Link>
          <Link className="btn btn-ghost dark" href="/admin/content">
            إضافة محتوى مجاني
          </Link>
          <Link className="btn btn-ghost dark" href="/admin/meetings">
            إدارة اللقاءات
          </Link>
          <Link className="btn btn-ghost dark" href="/admin/members">
            إدارة الأعضاء
          </Link>
        </div>
      </section>
    </AdminShell>
  );
}
