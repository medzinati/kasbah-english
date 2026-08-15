import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  postId: z.string().trim().min(1),
  body: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please write a reply." }, { status: 400 });
  }

  const post = await prisma.discussionPost.findUnique({
    where: { id: parsed.data.postId },
  });
  if (!post) {
    return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
  }

  await prisma.discussionComment.create({
    data: {
      postId: post.id,
      authorId: session.user.id,
      body: parsed.data.body,
    },
  });

  return NextResponse.json({ ok: true });
}
