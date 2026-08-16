import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendPasswordResetEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().email(),
});

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function siteUrl() {
  return (process.env.NEXTAUTH_URL || "https://kasbahenglish.com").replace(/\/$/, "");
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
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return ok to avoid email enumeration
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { email } });
  await prisma.passwordResetToken.create({
    data: { email, tokenHash, expiresAt },
  });

  const resetUrl = `${siteUrl()}/members/reset-password?token=${token}`;
  const mail = await sendPasswordResetEmail({
    to: email,
    name: user.name,
    resetUrl,
  });

  if (!mail.sent) {
    console.error("Password reset email failed", mail.error);
  }

  return NextResponse.json({ ok: true });
}
