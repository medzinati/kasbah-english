import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Members",
};

export default async function MembersHomePage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  return (
    <div className="members-shell">
      <header className="members-top">
        <div className="wrap members-top-inner">
          <Link className="logo ink" href="/members">
            Kasbah <span>English</span>
          </Link>
          <div className="members-top-actions">
            {session.user.role === "ADMIN" ? (
              <Link className="text-link" href="/admin">
                Admin
              </Link>
            ) : null}
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="wrap members-main">
        <p className="eyebrow">Members area</p>
        <h1>Welcome, {session.user.name?.split(" ")[0] || "member"}</h1>
        <p className="members-lede">
          You’re inside Kasbah English. Community discussions, groups, and Zoom-style meetings come next — this home is
          your starting point.
        </p>

        <div className="members-grid">
          <article>
            <h2>Community</h2>
            <p>Announcements and member updates will live here.</p>
            <span className="soon">Coming in Phase 3</span>
          </article>
          <article>
            <h2>Discussion groups</h2>
            <p>Topic spaces for speaking practice, exams, and career English.</p>
            <span className="soon">Coming in Phase 3</span>
          </article>
          <article>
            <h2>Meetings</h2>
            <p>Live sessions with Zoom links and a simple schedule.</p>
            <span className="soon">Coming in Phase 4</span>
          </article>
        </div>
      </main>
    </div>
  );
}
