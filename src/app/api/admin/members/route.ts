import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { generateTempPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { sendMemberWelcomeEmail } from "@/lib/mail";

async function requireAdminApi() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

const createSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "بيانات غير صحيحة." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: false, error: "هذا الإيميل مسجّل مسبقًا." }, { status: 400 });
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hash(tempPassword, 10);
  const member = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
      role: "MEMBER",
    },
  });

  await sendMemberWelcomeEmail({
    to: member.email,
    name: member.name,
    tempPassword,
  });

  return NextResponse.json({
    ok: true,
    tempPassword,
    member: {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      createdAt: member.createdAt.toISOString(),
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
  if (id === session.user.id) {
    return NextResponse.json({ ok: false, error: "لا يمكنك حذف حسابك." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ ok: false, error: "العضو غير موجود." }, { status: 404 });
  }
  if (user.role === "ADMIN") {
    return NextResponse.json({ ok: false, error: "لا يمكن حذف مدير." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
