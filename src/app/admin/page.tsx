import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminApplications } from "@/components/AdminApplications";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { GroupCreateForm } from "@/components/GroupCreateForm";
import { MeetingForm } from "@/components/MeetingForm";
import { MembersNav } from "@/components/MembersNav";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.members.admin };
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/members");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

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
      <MembersNav
        name={session.user.name}
        role={session.user.role}
        locale={locale}
        dict={dict}
        title={locale === "ar" ? "قصبة الإدارة" : "Kasbah Admin"}
      />

      <main className="wrap members-main">
        <p className="eyebrow">{dict.members.admin}</p>
        <h1>{dict.members.manage}</h1>
        <p className="members-lede">
          {dict.members.manageLede}{" "}
          <Link className="text-link" href="/members/meetings">
            {dict.members.viewMeetings}
          </Link>
        </p>

        <section className="members-section">
          <h2>{dict.members.applications}</h2>
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
