import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  meetingId: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
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
    return NextResponse.json({ ok: false, error: "Missing meeting." }, { status: 400 });
  }

  const meeting = await prisma.meeting.findUnique({ where: { id: parsed.data.meetingId } });
  if (!meeting) {
    return NextResponse.json({ ok: false, error: "Meeting not found." }, { status: 404 });
  }

  await prisma.meetingRegistration.upsert({
    where: {
      meetingId_userId: {
        meetingId: parsed.data.meetingId,
        userId: session.user.id!,
      },
    },
    update: {},
    create: {
      meetingId: parsed.data.meetingId,
      userId: session.user.id!,
    },
  });

  return NextResponse.json({ ok: true });
}
