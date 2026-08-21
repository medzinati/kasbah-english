import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { canTeach } from "@/lib/roles";

const schema = z.object({
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(10).max(5000),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  if (!canTeach(session.user.role)) {
    return NextResponse.json({ ok: false, error: "Only teachers and admins can post announcements." }, { status: 403 });
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

  await prisma.announcement.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      authorId: session.user.id,
    },
  });

  return NextResponse.json({ ok: true });
}
