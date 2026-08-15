import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GroupCreateForm } from "@/components/GroupCreateForm";
import { MembersNav } from "@/components/MembersNav";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Discussion groups",
};

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const groups = await prisma.discussionGroup.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} />
      <main className="wrap members-main">
        <p className="eyebrow">Discussions</p>
        <h1>Groups</h1>
        <p className="members-lede">Pick a group, start a thread, and practice with the community.</p>

        {session.user.role === "ADMIN" ? <GroupCreateForm /> : null}

        <div className="group-list">
          {groups.map((group) => (
            <article key={group.id} className="group-item">
              <div>
                <h2>
                  <Link href={`/members/groups/${group.slug}`}>{group.title}</Link>
                </h2>
                <p>{group.description}</p>
              </div>
              <p className="group-count">
                {group._count.posts} {group._count.posts === 1 ? "post" : "posts"}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
