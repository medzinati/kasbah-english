"use client";

import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

type MembersNavProps = {
  name?: string | null;
  role?: "ADMIN" | "MEMBER";
  title?: string;
};

export function MembersNav({ name, role, title = "كاسباه إنجليش" }: MembersNavProps) {
  const links = [
    { href: "/members", label: "الرئيسية" },
    { href: "/members/community", label: "المجتمع" },
    { href: "/members/groups", label: "المجموعات" },
    { href: "/members/meetings", label: "اللقاءات" },
    ...(role === "ADMIN" ? [{ href: "/admin", label: "الإدارة" }] : []),
  ];

  const parts = title.split(" ");

  return (
    <header className="members-top">
      <div className="wrap members-top-inner">
        <Link className="logo ink" href="/members">
          {parts.length > 1 ? (
            <>
              {parts[0]} <span>{parts.slice(1).join(" ")}</span>
            </>
          ) : (
            title
          )}
        </Link>
        <div className="members-top-actions">
          {name ? <span className="members-user">{name.split(" ")[0]}</span> : null}
          <SignOutButton />
        </div>
      </div>
      <nav className="members-nav-links wrap" aria-label="قائمة الأعضاء">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
