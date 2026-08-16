import { createHash } from "crypto";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().trim().min(20),
  password: z.string().min(8).max(72),
});

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const tokenHash = hashToken(parsed.data.token);
  const row = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!row || row.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ ok: false, error: "Invalid or expired link." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: row.email } });
  if (!user) {
    return NextResponse.json({ ok: false, error: "Invalid or expired link." }, { status: 400 });
  }

  const passwordHash = await hash(parsed.data.password, 10);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({ where: { email: row.email } }),
  ]);

  return NextResponse.json({ ok: true });
}
