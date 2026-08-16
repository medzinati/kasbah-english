import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "تم الدفع",
};

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function PaySuccessPage({ searchParams }: Props) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const params = await searchParams;
  const sessionId = params.session_id?.trim();

  let paid = false;
  if (sessionId) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
          paid = true;
          const applicationId = session.metadata?.applicationId;
          if (applicationId) {
            await prisma.application.update({
              where: { id: applicationId },
              data: { paymentStatus: "PAID", stripeSessionId: sessionId },
            });
          }
        }
      } catch {
        paid = false;
      }
    }
  }

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{locale === "ar" ? "الدفع" : "Payment"}</p>
            <h1>{paid ? (locale === "ar" ? "تم استلام الدفع" : "Payment received") : locale === "ar" ? "نراجع الدفع" : "Checking payment"}</h1>
            <p>
              {paid
                ? locale === "ar"
                  ? "شكرًا لك. سنراجع طلبك ونراسلك بعد القبول."
                  : "Thank you. We’ll review your application and email you after acceptance."
                : locale === "ar"
                  ? "إذا أكملت الدفع، سيظهر التأكيد خلال لحظات. يمكنك أيضًا مراسلتنا على واتساب."
                  : "If you completed payment, confirmation may take a moment. You can also message us on WhatsApp."}
            </p>
            <div className="cta-row" style={{ marginTop: "1.25rem" }}>
              <Link className="btn btn-primary" href="/">
                {locale === "ar" ? "العودة للرئيسية" : "Back home"}
              </Link>
              <Link className="btn btn-ghost dark" href="/news">
                {dict.nav.news}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
