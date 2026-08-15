import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CommentForm } from "@/components/CommentForm";
import { MembersNav } from "@/components/MembersNav";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Props = { params: Promise<{ slug: string; postId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = await prisma.discussionPost.findUnique({ where: { id: postId } });
  return { title: post?.title || "Discussion" };
}

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/members/login");
  }

  const { slug, postId } = await params;
  const post = await prisma.discussionPost.findUnique({
    where: { id: postId },
    include: {
      author: { select: { name: true } },
      group: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!post || post.group.slug !== slug) {
    notFound();
  }

  return (
    <div className="members-shell">
      <MembersNav name={session.user.name} role={session.user.role} />
      <main className="wrap members-main">
        <p className="eyebrow">
          <Link href={`/members/groups/${post.group.slug}`}>{post.group.title}</Link>
        </p>
        <h1>{post.title}</h1>
        <p className="feed-meta">
          {post.author.name} ·{" "}
          {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(post.createdAt)}
        </p>
        <p className="post-body">{post.body}</p>

        <section className="members-section">
          <h2>Replies ({post.comments.length})</h2>
          <div className="feed-list">
            {post.comments.length === 0 ? (
              <p className="members-empty">No replies yet.</p>
            ) : (
              post.comments.map((comment) => (
                <article key={comment.id} className="feed-item">
                  <p className="feed-meta">
                    {comment.author.name} ·{" "}
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(comment.createdAt)}
                  </p>
                  <p>{comment.body}</p>
                </article>
              ))
            )}
          </div>
          <CommentForm postId={post.id} />
        </section>
      </main>
    </div>
  );
}
