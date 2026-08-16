import Link from "next/link";
import { MembersNav } from "@/components/MembersNav";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const links = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/site", label: "محتوى الموقع" },
  { href: "/admin/applications", label: "الطلبات" },
  { href: "/admin/members", label: "الأعضاء" },
  { href: "/admin/news", label: "الأخبار" },
  { href: "/admin/videos", label: "الفيديوهات" },
  { href: "/admin/content", label: "المحتوى المجاني" },
  { href: "/admin/meetings", label: "اللقاءات" },
  { href: "/admin/community", label: "المجتمع" },
];

export function AdminShell({
  name,
  locale,
  dict,
  title,
  children,
}: {
  name?: string | null;
  locale: Locale;
  dict: Dictionary;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="members-shell">
      <MembersNav
        name={name}
        role="ADMIN"
        locale={locale}
        dict={dict}
        title={locale === "ar" ? "قصبة الإدارة" : "Kasbah Admin"}
      />
      <div className="wrap admin-layout">
        <aside className="admin-side" aria-label="إدارة">
          <p className="admin-side-title">لوحة الإدارة</p>
          <nav className="admin-side-nav">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="members-main admin-main">
          <p className="eyebrow">{dict.members.admin}</p>
          <h1>{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
