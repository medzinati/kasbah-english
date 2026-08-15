import type { Metadata } from "next";
import { AdminMeetingsPanel } from "@/components/AdminMeetingsPanel";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "اللقاءات" };
}

export const dynamic = "force-dynamic";

export default async function AdminMeetingsPage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const meetings = await prisma.meeting.findMany({
    orderBy: { startsAt: "desc" },
    include: {
      registrations: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const initial = meetings.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    startsAt: m.startsAt.toISOString(),
    durationMinutes: m.durationMinutes,
    zoomUrl: m.zoomUrl,
    attendees: m.registrations.map((r) => ({
      id: r.user.id,
      name: r.user.name,
      email: r.user.email,
    })),
  }));

  return (
    <AdminShell name={session.user.name} locale={locale} dict={dict} title="اللقاءات والحضور">
      <p className="members-lede">أنشئ لقاءات زوم وشاهد من سجّل للحضور من الأعضاء.</p>
      <AdminMeetingsPanel initial={initial} />
    </AdminShell>
  );
}
