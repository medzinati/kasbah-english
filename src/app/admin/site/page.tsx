import type { Metadata } from "next";
import { AdminShell } from "@/components/AdminShell";
import { AdminSiteEditor } from "@/components/AdminSiteEditor";
import { requireAdmin } from "@/lib/admin";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "محتوى الموقع" };
}

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const session = await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <AdminShell name={session.user.name} locale={locale} dict={dict} title="محتوى الموقع">
      <AdminSiteEditor />
    </AdminShell>
  );
}
