import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

type MembersNavProps = {
  name?: string | null;
  role?: "ADMIN" | "MEMBER";
  title?: string;
};

export function MembersNav({ name, role, title = "Kasbah English" }: MembersNavProps) {
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
        <nav className="members-nav-links" aria-label="Members">
          <Link href="/members">Home</Link>
          <Link href="/members/community">Community</Link>
          <Link href="/members/groups">Groups</Link>
          {role === "ADMIN" ? <Link href="/admin">Admin</Link> : null}
        </nav>
        <div className="members-top-actions">
          {name ? <span className="members-user">{name.split(" ")[0]}</span> : null}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
