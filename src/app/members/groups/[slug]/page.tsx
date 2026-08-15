import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MembersNav } from "@/components/MembersNav";
import { NewPostForm } from "@/components/NewPostForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const group = await prisma.discussionGroup.findUnique({ where: { slug } });
  return { title: group?.title || "مجموعة" };
}

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const { slug } = await params;
  const group = await prisma.discussionGroup.findUnique({
    where: { slug },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
          _count: { select: { comments: true } },
        },
      },
    },
  });

  if (!group) {
    notFound();
  }

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} />
      <main className="wrap members-main">
        <p className="eyebrow">
          <Link href="/members/groups">المجموعات</Link>
        </p>
        <h1>{group.title}</h1>
        <p className="members-lede">{group.description}</p>

        <NewPostForm groupSlug={group.slug} />

        <div className="feed-list">
          {group.posts.length === 0 ? (
            <p className="members-empty">ما كاين حتى نقاش دابا. كون أول واحد ينشر.</p>
          ) : (
            group.posts.map((post) => (
              <article key={post.id} className="feed-item">
                <h3>
                  <Link href={`/members/groups/${group.slug}/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="feed-meta">
                  {post.author.name} ·{" "}
                  {new Intl.DateTimeFormat("ar", { dateStyle: "medium" }).format(post.createdAt)} ·{" "}
                  {post._count.comments} {post._count.comments === 1 ? "رد" : "ردود"}
                </p>
                <p>{post.body.length > 220 ? `${post.body.slice(0, 220)}…` : post.body}</p>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
