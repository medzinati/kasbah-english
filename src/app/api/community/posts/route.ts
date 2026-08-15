import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  groupSlug: z.string().trim().min(1),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(10).max(8000),
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
    return NextResponse.json({ ok: false, error: "Please fill title and message." }, { status: 400 });
  }

  const group = await prisma.discussionGroup.findUnique({
    where: { slug: parsed.data.groupSlug },
  });
  if (!group) {
    return NextResponse.json({ ok: false, error: "Group not found." }, { status: 404 });
  }

  const post = await prisma.discussionPost.create({
    data: {
      groupId: group.id,
      authorId: session.user.id,
      title: parsed.data.title,
      body: parsed.data.body,
    },
  });

  return NextResponse.json({ ok: true, postId: post.id });
}
