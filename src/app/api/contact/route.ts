import { NextResponse } from "next/server";

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ ok: false, error: "Please fill in all fields." }, { status: 400 });
  }

  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  const inbox = process.env.CONTACT_EMAIL || "mohamed.ketrani.zinati@gmail.com";

  try {
    const form = new FormData();
    form.set("name", name);
    form.set("email", email);
    form.set("subject", subject);
    form.set("message", message);
    form.set("_subject", `Kasbah English contact — ${subject}`);
    form.set("_template", "table");
    form.set("_captcha", "false");

    const res = await fetch(`https://formsubmit.co/ajax/${inbox}`, {
      method: "POST",
      body: form,
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.error("Contact formsubmit failed", await res.text());
      return NextResponse.json(
        { ok: false, error: "Could not send message right now. Please try again shortly." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Contact submit error", error);
    return NextResponse.json(
      { ok: false, error: "Could not send message right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
