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

function isPlaceholderZoom(url: string) {
  const u = url.toLowerCase();
  return (
    !u ||
    u.includes("00000000000") ||
    u.includes("your-meeting") ||
    u.includes("example")
  );
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [pendingApps, members, videos, lessons, upcomingMeetings, announcements, nextMeeting] =
    await Promise.all([
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "MEMBER" } }),
      prisma.video.count(),
      prisma.freeLesson.count(),
      prisma.meeting.count({ where: { startsAt: { gte: new Date() } } }),
      prisma.announcement.count(),
      prisma.meeting.findFirst({
        where: { startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
        select: { id: true, title: true, zoomUrl: true, startsAt: true },
      }),
    ]);

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
  const gaReady = Boolean(gaId && /^G-[A-Z0-9]+$/i.test(gaId));
  const zoomReady = Boolean(nextMeeting && !isPlaceholderZoom(nextMeeting.zoomUrl));

  const cards = [
    { href: "/admin/site", label: "محتوى الموقع", value: "CMS" },
    { href: "/admin/applications", label: "طلبات بانتظار المراجعة", value: pendingApps },
    { href: "/admin/members", label: "الأعضاء", value: members },
    { href: "/admin/videos", label: "الفيديوهات", value: videos },
    { href: "/admin/content", label: "دروس مجانية", value: lessons },
    { href: "/admin/meetings", label: "لقاءات قادمة", value: upcomingMeetings },
    { href: "/admin/community", label: "إعلانات", value: announcements },
  ];

  const sharePosts = [
    {
      label: "واتساب / ستوري",
      text: `اختبر مستواك مجانًا في قصبة إنجليش 👇\nhttps://www.kasbahenglish.com/level-test`,
    },
    {
      label: "إنستغرام / تويتر",
      text: `تعلّم الإنجليزية أونلاين مع مجتمع منظم ودروس مجانية ولقاءات Zoom.\nابدأ من هنا: https://www.kasbahenglish.com`,
    },
    {
      label: "الامتحانات",
      text: `تحضير IELTS / TOEFL / TOEIC / PTE مع قصبة إنجليش:\nhttps://www.kasbahenglish.com/exams`,
    },
  ];

  return (
    <AdminShell name={session.user.name} locale={locale} dict={dict} title="لوحة التحكم">
      <p className="members-lede">تحكم كامل: محتوى الموقع العام، الأعضاء، الأخبار، الفيديوهات، واللقاءات.</p>

      <section className="members-section admin-checklist">
        <h2>حالة التشغيل</h2>
        <ul className="admin-status-list">
          <li className={gaReady ? "is-ready" : "is-pending"}>
            <strong>Google Analytics:</strong>{" "}
            {gaReady ? (
              <>مفعّل ({gaId})</>
            ) : (
              <>
                غير مفعّل — أنشئ Measurement ID من{" "}
                <a href="https://analytics.google.com" target="_blank" rel="noreferrer">
                  analytics.google.com
                </a>{" "}
                ثم ضع <code>NEXT_PUBLIC_GA_MEASUREMENT_ID</code> في Vercel.
              </>
            )}
          </li>
          <li className={zoomReady ? "is-ready" : "is-pending"}>
            <strong>Zoom:</strong>{" "}
            {zoomReady && nextMeeting ? (
              <>
                جاهز — {nextMeeting.title} (
                <Link href="/admin/meetings">تعديل</Link>)
              </>
            ) : (
              <>
                يحتاج رابط حقيقي — افتح{" "}
                <Link href="/admin/meetings">اللقاءات</Link> واستبدل الرابط التجريبي.
              </>
            )}
          </li>
          <li className={pendingApps === 0 ? "is-ready" : "is-pending"}>
            <strong>الطلبات:</strong>{" "}
            {pendingApps === 0 ? (
              "لا طلبات معلّقة"
            ) : (
              <>
                {pendingApps} بانتظار المراجعة —{" "}
                <Link href="/admin/applications">افتح الطلبات</Link>
              </>
            )}
          </li>
        </ul>
      </section>

      <section className="members-section admin-checklist">
        <h2>نصوص جاهزة للنشر (SEO / وصول)</h2>
        <p className="members-lede">انسخ والصق على واتساب أو إنستغرام أو تويتر — روابط مباشرة لموقعك.</p>
        <div className="admin-share-kit">
          {sharePosts.map((post) => (
            <div key={post.label} className="admin-share-card">
              <strong>{post.label}</strong>
              <pre dir="auto">{post.text}</pre>
            </div>
          ))}
        </div>
      </section>

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
          <Link className="btn btn-ghost dark" href="/admin/news">
            الأخبار
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
