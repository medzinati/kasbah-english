import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MeetingForm } from "@/components/MeetingForm";
import { MeetingList } from "@/components/MeetingList";
import { MembersNav } from "@/components/MembersNav";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.members.meetings };
}

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

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
      <MembersNav name={session.user.name} role={session.user.role} locale={locale} dict={dict} />
      <main className="wrap members-main">
        <p className="eyebrow">{dict.members.livePractice}</p>
        <h1>{dict.members.meetings}</h1>
        <p className="members-lede">{dict.members.meetingsLede}</p>

        {session.user.role === "ADMIN" ? <MeetingForm /> : null}

        <section className="members-section">
          <h2>{dict.members.upcoming}</h2>
          <MeetingList
            meetings={upcoming}
            isAdmin={session.user.role === "ADMIN"}
            emptyText={dict.members.noUpcoming}
          />
        </section>

        {past.length ? (
          <section className="members-section">
            <h2>{dict.members.past}</h2>
            <MeetingList meetings={past} isAdmin={session.user.role === "ADMIN"} />
          </section>
        ) : null}
      </main>
    </div>
  );
}
