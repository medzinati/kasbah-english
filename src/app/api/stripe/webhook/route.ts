import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const rawBody = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id?: string; metadata?: { applicationId?: string } };
    const applicationId = session.metadata?.applicationId;
    if (applicationId) {
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          paymentStatus: "PAID",
          stripeSessionId: session.id || undefined,
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
