import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MeetingForm } from "@/components/MeetingForm";
import { MeetingList } from "@/components/MeetingList";
import { MembersNav } from "@/components/MembersNav";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "اللقاءات",
};

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const meetings = await prisma.meeting.findMany({
    orderBy: { startsAt: "asc" },
    include: { createdBy: { select: { name: true } } },
  });

  const now = Date.now();
  const mapped = meetings.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    startsAt: m.startsAt.toISOString(),
    durationMinutes: m.durationMinutes,
    zoomUrl: m.zoomUrl,
    createdByName: m.createdBy.name,
  }));

  const upcoming = mapped.filter((m) => {
    const end = new Date(m.startsAt).getTime() + m.durationMinutes * 60_000;
    return end >= now;
  });
  const past = mapped
    .filter((m) => {
      const end = new Date(m.startsAt).getTime() + m.durationMinutes * 60_000;
      return end < now;
    })
    .reverse();

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} />
      <main className="wrap members-main">
        <p className="eyebrow">تدريب مباشر</p>
        <h1>اللقاءات</h1>
        <p className="members-lede">
          انضم لحصص زوم القادمة. افتح الرابط قبل دقايق وجي مستعد تتكلّم.
        </p>

        {session.user.role === "ADMIN" ? <MeetingForm /> : null}

        <section className="members-section">
          <h2>القادمة</h2>
          <MeetingList
            meetings={upcoming}
            isAdmin={session.user.role === "ADMIN"}
            emptyText="ما كاين حتى لقاء قادم دابا. رجّع شوف من بعد."
          />
        </section>

        {past.length ? (
          <section className="members-section">
            <h2>السابقة</h2>
            <MeetingList meetings={past} isAdmin={session.user.role === "ADMIN"} />
          </section>
        ) : null}
      </main>
    </div>
  );
}
