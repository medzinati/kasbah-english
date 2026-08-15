import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  location: z.string().trim().min(2),
  whatsapp: z.string().trim().optional(),
  level: z.string().trim().min(2),
  goal: z.string().trim().min(2),
  motivation: z.string().trim().min(10),
});

export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please fill in all required fields correctly." }, { status: 400 });
  }

  const data = parsed.data;
  const email = data.email.toLowerCase();

  try {
    await prisma.application.create({
      data: {
        name: data.name,
        email,
        location: data.location,
        whatsapp: data.whatsapp || null,
        level: data.level,
        goal: data.goal,
        motivation: data.motivation,
      },
    });
  } catch (error) {
    console.error("Apply DB error", error);
    return NextResponse.json(
      { ok: false, error: "Could not save application. Please try again shortly." },
      { status: 500 },
    );
  }

  // Best-effort email notify (does not block success)
  const inbox = process.env.CONTACT_EMAIL || "mohamed.ketrani.zinati@gmail.com";
  try {
    const form = new FormData();
    form.set("name", data.name);
    form.set("email", email);
    form.set("location", data.location);
    form.set("whatsapp", data.whatsapp || "—");
    form.set("level", data.level);
    form.set("goal", data.goal);
    form.set("motivation", data.motivation);
    form.set("_subject", `Kasbah English application — ${data.name}`);
    form.set("_template", "table");
    form.set("_captcha", "false");
    await fetch(`https://formsubmit.co/ajax/${inbox}`, {
      method: "POST",
      body: form,
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    console.error("Apply notify error", error);
  }

  return NextResponse.json({ ok: true });
}
