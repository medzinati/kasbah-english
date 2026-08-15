import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().trim().min(3).max(80),
  description: z.string().trim().min(10).max(500),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Only admins can create groups." }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please fill title and description." }, { status: 400 });
  }

  const base = slugify(parsed.data.title) || `group-${Date.now()}`;
  let slug = base;
  let i = 1;
  while (await prisma.discussionGroup.findUnique({ where: { slug } })) {
    slug = `${base}-${i}`;
    i += 1;
  }

  const group = await prisma.discussionGroup.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      slug,
      createdById: session.user.id,
    },
  });

  return NextResponse.json({ ok: true, slug: group.slug });
}
