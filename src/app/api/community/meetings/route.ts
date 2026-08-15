import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  startsAt: z.string().min(1),
  durationMinutes: z.coerce.number().int().min(15).max(240).default(60),
  zoomUrl: z.string().trim().url(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Only admins can create meetings." }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please fill all fields with a valid Zoom/Meet link and date." },
      { status: 400 },
    );
  }

  const startsAt = new Date(parsed.data.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ ok: false, error: "Invalid date/time." }, { status: 400 });
  }

  const meeting = await prisma.meeting.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      startsAt,
      durationMinutes: parsed.data.durationMinutes,
      zoomUrl: parsed.data.zoomUrl,
      createdById: session.user.id,
    },
  });

  return NextResponse.json({ ok: true, id: meeting.id });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing meeting id." }, { status: 400 });
  }

  await prisma.meeting.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
