"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SignOutButton } from "@/components/SignOutButton";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type MembersNavProps = {
  name?: string | null;
  role?: "ADMIN" | "MEMBER";
  locale: Locale;
  dict: Dictionary;
  title?: string;
};

export function MembersNav({ name, role, locale, dict, title }: MembersNavProps) {
  const brand = title || dict.brand;
  const parts = brand.split(" ");
  const links = [
    { href: "/members", label: dict.members.home },
    { href: "/members/community", label: dict.members.community },
    { href: "/members/groups", label: dict.members.groups },
    { href: "/members/meetings", label: dict.members.meetings },
    { href: "/members/videos", label: locale === "ar" ? "الفيديوهات" : "Videos" },
    ...(role === "ADMIN" ? [{ href: "/admin", label: dict.members.admin }] : []),
  ];

  return (
    <header className="members-top">
      <div className="wrap members-top-inner">
        <Link className="logo ink" href="/members">
          {parts.length > 1 ? (
            <>
              {parts[0]} <span>{parts.slice(1).join(" ")}</span>
            </>
          ) : (
            brand
          )}
        </Link>
        <div className="members-top-actions">
          <LanguageSwitcher locale={locale} labelAr={dict.lang.ar} labelEn={dict.lang.en} />
          {name ? <span className="members-user">{name.split(" ")[0]}</span> : null}
          <SignOutButton label={dict.members.signOut} />
        </div>
      </div>
      <nav className="members-nav-links wrap" aria-label={dict.members.memberNav}>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
