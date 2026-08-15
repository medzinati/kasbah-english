import type { Metadata } from "next";
import { AdminMembers } from "@/components/AdminMembers";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "الأعضاء" };
}

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const members = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const initial = members.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role as "ADMIN" | "MEMBER",
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <AdminShell name={session.user.name} locale={locale} dict={dict} title="إدارة الأعضاء">
      <p className="members-lede">أضف أعضاءً يدويًا، أو احذف من لم يعد في المجتمع.</p>
      <AdminMembers initial={initial} currentUserId={session.user.id!} />
    </AdminShell>
  );
}
