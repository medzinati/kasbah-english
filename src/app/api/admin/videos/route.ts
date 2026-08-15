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
  description: z.string().trim().min(2),
  url: z.string().trim().url(),
  published: z.boolean().optional(),
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

  const video = await prisma.video.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      url: parsed.data.url,
      published: parsed.data.published ?? true,
      createdById: session.user.id!,
    },
  });

  return NextResponse.json({
    ok: true,
    video: {
      id: video.id,
      title: video.title,
      description: video.description,
      url: video.url,
      published: video.published,
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
  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
