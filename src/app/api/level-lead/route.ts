import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  whatsapp: z.string().trim().optional(),
  levelCode: z.string().trim().min(1),
  levelName: z.string().trim().min(1),
  track: z.string().trim().min(1),
  score: z.number().int().min(0).max(20),
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
    return NextResponse.json(
      { ok: false, error: "Please enter a valid name and email." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const email = data.email.toLowerCase();
  const level = `${data.levelCode} ${data.levelName}`;
  const motivation = `Level test lead · score ${data.score} · track ${data.track}`;

  try {
    await prisma.application.create({
      data: {
        name: data.name,
        email,
        location: "Pending",
        whatsapp: data.whatsapp || null,
        level,
        goal: "Level test",
        plan: null,
        motivation,
        paymentStatus: "UNPAID",
      },
    });
  } catch (error) {
    console.error("Level lead DB error", error);
    return NextResponse.json(
      { ok: false, error: "Could not save. Please try again shortly." },
      { status: 500 },
    );
  }

  const inbox = process.env.CONTACT_EMAIL || "mohamed.ketrani.zinati@gmail.com";
  try {
    const form = new FormData();
    form.set("name", data.name);
    form.set("email", email);
    form.set("whatsapp", data.whatsapp || "—");
    form.set("level", level);
    form.set("track", data.track);
    form.set("score", String(data.score));
    form.set("_subject", `Kasbah English level test lead — ${data.name}`);
    form.set("_template", "table");
    form.set("_captcha", "false");
    await fetch(`https://formsubmit.co/ajax/${inbox}`, {
      method: "POST",
      body: form,
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    console.error("Level lead notify error", error);
  }

  return NextResponse.json({ ok: true });
}
