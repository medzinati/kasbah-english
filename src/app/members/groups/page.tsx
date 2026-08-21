import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GroupCreateForm } from "@/components/GroupCreateForm";
import { MembersNav } from "@/components/MembersNav";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";
import { canTeach } from "@/lib/roles";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.members.groups };
}

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const groups = await prisma.discussionGroup.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} locale={locale} dict={dict} />
      <main className="wrap members-main">
        <p className="eyebrow">{dict.members.discussions}</p>
        <h1>{dict.members.groups}</h1>
        <p className="members-lede">{dict.members.groupsHero}</p>

        {canTeach(session.user.role) ? <GroupCreateForm /> : null}

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
                {group._count.posts} {group._count.posts === 1 ? dict.members.post : dict.members.posts}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
