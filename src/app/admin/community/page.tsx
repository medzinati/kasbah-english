import type { Metadata } from "next";
import { AdminShell } from "@/components/AdminShell";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { GroupCreateForm } from "@/components/GroupCreateForm";
import { requireAdmin } from "@/lib/admin";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "المجتمع" };
}

export const dynamic = "force-dynamic";

export default async function AdminCommunityPage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <AdminShell name={session.user.name} locale={locale} dict={dict} title="نشر للمجتمع">
      <p className="members-lede">انشر إعلانات أو أنشئ مجموعات نقاش جديدة للأعضاء.</p>
      <section className="members-section admin-tools">
        <AnnouncementForm />
        <GroupCreateForm />
      </section>
    </AdminShell>
  );
}
