import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdminApi() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

const schema = z.object({
  title: z.string().trim().min(2),
  summary: z.string().trim().min(2),
  level: z.string().trim().min(1),
  duration: z.string().trim().min(1),
  lessons: z.string().trim().min(2),
  imageUrl: z.string().trim().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "بيانات غير صحيحة." }, { status: 400 });
  }

  const imageUrl = parsed.data.imageUrl?.trim() || null;

  const lesson = await prisma.freeLesson.create({
    data: {
      title: parsed.data.title,
      summary: parsed.data.summary,
      level: parsed.data.level,
      duration: parsed.data.duration,
      lessons: parsed.data.lessons,
      imageUrl,
      published: parsed.data.published ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
      createdById: session.user.id!,
    },
  });

  return NextResponse.json({
    ok: true,
    lesson: {
      id: lesson.id,
      title: lesson.title,
      summary: lesson.summary,
      level: lesson.level,
      duration: lesson.duration,
      lessons: lesson.lessons,
      imageUrl: lesson.imageUrl,
      published: lesson.published,
      sortOrder: lesson.sortOrder,
    },
  });
}

export async function DELETE(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });
  }
  await prisma.freeLesson.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
