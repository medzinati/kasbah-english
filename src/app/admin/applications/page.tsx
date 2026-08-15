import type { Metadata } from "next";
import { AdminApplications } from "@/components/AdminApplications";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "الطلبات" };
}

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  const planLabels: Record<string, string> = {
    "1m": "شهر واحد — 99 ر.س",
    "3m": "٣ أشهر — 249 ر.س",
    "6m": "٦ أشهر — 399 ر.س",
    "12m": "سنة واحدة — 699 ر.س",
    "36m": "٣ سنوات — 1499 ر.س",
  };

  const initial = applications.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    location: item.location,
    whatsapp: item.whatsapp,
    level: item.level,
    goal: item.goal,
    plan: item.plan ? planLabels[item.plan] || item.plan : null,
    motivation: item.motivation,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <AdminShell name={session.user.name} locale={locale} dict={dict} title="طلبات التسجيل">
      <p className="members-lede">اقبل أو ارفض الطلبات. عند القبول يُنشأ حساب العضو.</p>
      <AdminApplications initial={initial} />
    </AdminShell>
  );
}
