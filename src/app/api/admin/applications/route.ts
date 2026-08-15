import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateTempPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

type Body = {
  applicationId?: string;
  action?: "accept" | "reject";
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const applicationId = body.applicationId?.trim();
  const action = body.action;

  if (!applicationId || (action !== "accept" && action !== "reject")) {
    return NextResponse.json({ ok: false, error: "Missing application or action." }, { status: 400 });
  }

  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application) {
    return NextResponse.json({ ok: false, error: "Application not found." }, { status: 404 });
  }

  if (action === "reject") {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "REJECTED", reviewedAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }

  if (application.status === "ACCEPTED" && application.userId) {
    return NextResponse.json({ ok: false, error: "Already accepted." }, { status: 400 });
  }

  const email = application.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "ACCEPTED", reviewedAt: new Date(), userId: existing.id },
    });
    return NextResponse.json({
      ok: true,
      message: "Application linked to an existing member account.",
      email: existing.email,
    });
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hash(tempPassword, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: application.name,
      passwordHash,
      role: "MEMBER",
    },
  });

  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: "ACCEPTED",
      reviewedAt: new Date(),
      userId: user.id,
    },
  });

  return NextResponse.json({
    ok: true,
    email: user.email,
    tempPassword,
    message: "Member created. Share the temporary password privately (WhatsApp/email).",
  });
}
