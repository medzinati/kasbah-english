import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MeetingForm } from "@/components/MeetingForm";
import { MeetingList } from "@/components/MeetingList";
import { MembersNav } from "@/components/MembersNav";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Meetings",
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
        <p className="eyebrow">Live practice</p>
        <h1>Meetings</h1>
        <p className="members-lede">
          Join upcoming Zoom sessions. Open the link a few minutes early and come ready to speak.
        </p>

        {session.user.role === "ADMIN" ? <MeetingForm /> : null}

        <section className="members-section">
          <h2>Upcoming</h2>
          <MeetingList
            meetings={upcoming}
            isAdmin={session.user.role === "ADMIN"}
            emptyText="No upcoming meetings yet. Check back soon."
          />
        </section>

        {past.length ? (
          <section className="members-section">
            <h2>Past</h2>
            <MeetingList meetings={past} isAdmin={session.user.role === "ADMIN"} />
          </section>
        ) : null}
      </main>
    </div>
  );
}
