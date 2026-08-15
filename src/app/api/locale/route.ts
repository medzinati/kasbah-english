import { NextResponse } from "next/server";
import { isLocale, localeCookie } from "@/i18n/config";

export async function POST(request: Request) {
  let body: { locale?: string };
  try {
    body = (await request.json()) as { locale?: string };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!isLocale(body.locale)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(localeCookie, body.locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
