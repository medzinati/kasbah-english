import { NextResponse } from "next/server";

type ApplyBody = {
  name?: string;
  email?: string;
  location?: string;
  whatsapp?: string;
  level?: string;
  goal?: string;
  motivation?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: ApplyBody;

  try {
    body = (await request.json()) as ApplyBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const location = String(body.location || "").trim();
  const whatsapp = String(body.whatsapp || "").trim();
  const level = String(body.level || "").trim();
  const goal = String(body.goal || "").trim();
  const motivation = String(body.motivation || "").trim();

  if (!name || !email || !location || !level || !goal || !motivation) {
    return NextResponse.json({ ok: false, error: "Please fill in all required fields." }, { status: 400 });
  }

  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  const inbox = process.env.CONTACT_EMAIL || "mohamed.ketrani.zinati@gmail.com";

  try {
    const form = new FormData();
    form.set("name", name);
    form.set("email", email);
    form.set("location", location);
    form.set("whatsapp", whatsapp || "—");
    form.set("level", level);
    form.set("goal", goal);
    form.set("motivation", motivation);
    form.set("_subject", `Kasbah English application — ${name}`);
    form.set("_template", "table");
    form.set("_captcha", "false");

    const res = await fetch(`https://formsubmit.co/ajax/${inbox}`, {
      method: "POST",
      body: form,
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.error("Apply formsubmit failed", await res.text());
      return NextResponse.json(
        { ok: false, error: "Could not send application right now. Please try again or use the contact page." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Apply submit error", error);
    return NextResponse.json(
      { ok: false, error: "Could not send application right now. Please try again or use the contact page." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
