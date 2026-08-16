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

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const schema = z.object({
  slug: z.string().trim().optional(),
  date: z.string().trim().optional(),
  imageUrl: z.string().trim().min(1),
  imageAltAr: z.string().trim().min(2),
  imageAltEn: z.string().trim().min(2),
  titleAr: z.string().trim().min(2),
  titleEn: z.string().trim().min(2),
  summaryAr: z.string().trim().min(2),
  summaryEn: z.string().trim().min(2),
  bodyAr: z.string().trim().min(20),
  bodyEn: z.string().trim().min(20),
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
    return NextResponse.json({ ok: false, error: "بيانات غير كاملة." }, { status: 400 });
  }

  const data = parsed.data;
  const baseSlug = data.slug?.trim() || slugify(data.titleEn) || `news-${Date.now()}`;
  let slug = baseSlug;
  let i = 1;
  while (await prisma.newsPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const paragraphsAr = data.bodyAr
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const paragraphsEn = data.bodyEn
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const post = await prisma.newsPost.create({
    data: {
      slug,
      date: data.date ? new Date(data.date) : new Date(),
      imageUrl: data.imageUrl,
      imageAltAr: data.imageAltAr,
      imageAltEn: data.imageAltEn,
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      summaryAr: data.summaryAr,
      summaryEn: data.summaryEn,
      bodyAr: JSON.stringify(paragraphsAr),
      bodyEn: JSON.stringify(paragraphsEn),
      published: data.published ?? true,
      createdById: session.user.id!,
    },
  });

  return NextResponse.json({
    ok: true,
    post: {
      id: post.id,
      slug: post.slug,
      titleAr: post.titleAr,
      published: post.published,
      imageUrl: post.imageUrl,
      date: post.date.toISOString(),
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
  await prisma.newsPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
