import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { planCheckoutAmountSar } from "@/lib/pricing";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const schema = z.object({
  applicationId: z.string().trim().min(1),
});

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { ok: false, error: "الدفع الإلكتروني غير مفعّل بعد. تواصل عبر واتساب." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "طلب غير صالح." }, { status: 400 });
  }

  const application = await prisma.application.findUnique({
    where: { id: parsed.data.applicationId },
  });
  if (!application) {
    return NextResponse.json({ ok: false, error: "الطلب غير موجود." }, { status: 404 });
  }
  if (application.paymentStatus === "PAID") {
    return NextResponse.json({ ok: false, error: "هذا الطلب مدفوع مسبقًا." }, { status: 400 });
  }

  const amountSar = planCheckoutAmountSar(application.plan);
  if (!amountSar) {
    return NextResponse.json(
      { ok: false, error: "اختر باقة أولًا أو ادفع عبر واتساب." },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "Stripe غير جاهز." }, { status: 503 });
  }

  const origin = new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: application.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "sar",
          unit_amount: amountSar * 100,
          product_data: {
            name: `Kasbah English — ${application.plan}`,
            description: `Membership plan ${application.plan} for ${application.name}`,
          },
        },
      },
    ],
    metadata: {
      applicationId: application.id,
      plan: application.plan || "",
    },
    success_url: `${origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/apply?payment=cancelled`,
  });

  await prisma.application.update({
    where: { id: application.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ ok: true, url: session.url });
}
