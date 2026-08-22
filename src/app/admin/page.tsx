import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { isMailConfigured } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { getOpsSettings, isPlaceholderZoomUrl } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "لوحة التحكم" };
}

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [pendingApps, members, videos, lessons, upcomingMeetings, announcements, nextMeeting, ops] =
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
      getOpsSettings(),
    ]);

  const gaId = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || ops.gaMeasurementId || "").trim();
  const gaReady = Boolean(gaId && /^G-[A-Z0-9]+$/i.test(gaId));
  const zoomFromMeeting = nextMeeting && !isPlaceholderZoomUrl(nextMeeting.zoomUrl);
  const zoomFromOps = Boolean(ops.defaultZoomUrl && !isPlaceholderZoomUrl(ops.defaultZoomUrl));
  const zoomReady = Boolean(zoomFromMeeting || zoomFromOps);
  const mailReady = isMailConfigured();

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
                غير مفعّل — ضع المعرّف من{" "}
                <Link href="/admin/site">الموقع → تشغيل</Link> (مثل G-XXXX).
              </>
            )}
          </li>
          <li className={zoomReady ? "is-ready" : "is-pending"}>
            <strong>Zoom:</strong>{" "}
            {zoomReady ? (
              <>
                جاهز{" "}
                {nextMeeting ? (
                  <>
                    — {nextMeeting.title} (<Link href="/admin/meetings">تعديل</Link>)
                  </>
                ) : (
                  <>
                    — رابط افتراضي محفوظ (<Link href="/admin/site">تشغيل</Link>)
                  </>
                )}
              </>
            ) : (
              <>
                يحتاج رابط حقيقي —{" "}
                <Link href="/admin/site">الموقع → تشغيل</Link> أو{" "}
                <Link href="/admin/meetings">اللقاءات</Link>.
              </>
            )}
          </li>
          <li className={mailReady ? "is-ready" : "is-pending"}>
            <strong>بريد الترحيب:</strong>{" "}
            {mailReady ? (
              "مفعّل — عند قبول عضو يُرسل إيميل بكلمة المرور."
            ) : (
              <>
                غير مفعّل — ضع <code>GMAIL_APP_PASSWORD</code> في Vercel (مع GMAIL_USER).
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
