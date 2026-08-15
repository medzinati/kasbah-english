"use client";

import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

type MembersNavProps = {
  name?: string | null;
  role?: "ADMIN" | "MEMBER";
  title?: string;
};

export function MembersNav({ name, role, title = "Kasbah English" }: MembersNavProps) {
  const links = [
    { href: "/members", label: "Home" },
    { href: "/members/community", label: "Community" },
    { href: "/members/groups", label: "Groups" },
    { href: "/members/meetings", label: "Meetings" },
    ...(role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="members-top">
      <div className="wrap members-top-inner">
        <Link className="logo ink" href="/members">
          {title.includes(" ") ? (
            <>
              {title.split(" ")[0]} <span>{title.split(" ").slice(1).join(" ")}</span>
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
      <nav className="members-nav-links wrap" aria-label="Members">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
