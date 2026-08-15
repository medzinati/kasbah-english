import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminApplications } from "@/components/AdminApplications";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { GroupCreateForm } from "@/components/GroupCreateForm";
import { MeetingForm } from "@/components/MeetingForm";
import { MembersNav } from "@/components/MembersNav";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "الإدارة",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/members");
  }

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  const initial = applications.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    location: item.location,
    whatsapp: item.whatsapp,
    level: item.level,
    goal: item.goal,
    motivation: item.motivation,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} title="كاسباه الإدارة" />

      <main className="wrap members-main">
        <p className="eyebrow">الإدارة</p>
        <h1>تسيير المجتمع</h1>
        <p className="members-lede">
          قبول الأعضاء، نشر الإعلانات، إنشاء المجموعات، وجدولة لقاءات زوم.{" "}
          <Link className="text-link" href="/members/meetings">
            عرض اللقاءات
          </Link>
        </p>

        <section className="members-section">
          <h2>طلبات التسجيل</h2>
          <AdminApplications initial={initial} />
        </section>

        <section className="members-section admin-tools">
          <AnnouncementForm />
          <GroupCreateForm />
        </section>

        <section className="members-section">
          <MeetingForm />
        </section>
      </main>
    </div>
  );
}
