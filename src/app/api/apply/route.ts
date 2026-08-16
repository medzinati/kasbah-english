import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const planIds = ["1m", "3m", "6m", "12m", "36m"] as const;

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  whatsapp: z.string().trim().optional(),
  plan: z.union([z.enum(planIds), z.literal("")]).optional(),
  level: z.string().trim().optional(),
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
  const plan = data.plan && data.plan.length > 0 ? data.plan : null;
  const level = data.level && data.level.length > 0 ? data.level : "Pending";
  const pending = "Pending";

  try {
    await prisma.application.create({
      data: {
        name: data.name,
        email,
        location: pending,
        whatsapp: data.whatsapp || null,
        level,
        goal: pending,
        plan,
        motivation: "",
      },
    });
  } catch (error) {
    console.error("Apply DB error", error);
    return NextResponse.json(
      { ok: false, error: "Could not save application. Please try again shortly." },
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
    form.set("plan", plan || "—");
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
