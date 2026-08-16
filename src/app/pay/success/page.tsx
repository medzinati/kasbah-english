import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { getWhatsAppHref } from "@/lib/site-contact";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "ar" ? "تم الدفع" : "Payment received",
  };
}

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

  const copy = locale === "ar"
    ? {
        eyebrow: "الدفع",
        titlePaid: "تم استلام الدفع",
        titlePending: "نراجع الدفع",
        ledePaid: "شكرًا لك. الدفع وصل بنجاح.",
        ledePending: "إذا أكملت الدفع، سيظهر التأكيد خلال لحظات.",
        nextTitle: "ماذا بعد؟",
        steps: [
          "نراجع طلبك خلال يوم إلى يومين عمل.",
          "عند القبول، يصلك إيميل ببيانات الدخول لمساحة الأعضاء.",
          "إذا احتجت شيئًا الآن، راسلنا على واتساب وسنساعدك.",
        ],
        home: "العودة للرئيسية",
        whatsapp: "واتساب الآن",
        prefill: "مرحبًا، أكملت الدفع وأريد معرفة الخطوة التالية.",
      }
    : {
        eyebrow: "Payment",
        titlePaid: "Payment received",
        titlePending: "Checking payment",
        ledePaid: "Thank you. Your payment was received successfully.",
        ledePending: "If you completed payment, confirmation may take a moment.",
        nextTitle: "What happens next?",
        steps: [
          "We review your application within 1–2 business days.",
          "If accepted, you’ll get an email with members-area login details.",
          "Need help now? Message us on WhatsApp and we’ll assist you.",
        ],
        home: "Back home",
        whatsapp: "WhatsApp now",
        prefill: "Hello, I completed payment and want to know the next step.",
      };

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <section className="page-hero" data-reveal="fade">
          <div className="wrap page-hero-inner">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{paid ? copy.titlePaid : copy.titlePending}</h1>
            <p>{paid ? copy.ledePaid : copy.ledePending}</p>
          </div>
        </section>

        <section className="section" data-reveal>
          <div className="wrap pay-next">
            <h2>{copy.nextTitle}</h2>
            <ol className="steps-list">
              {copy.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="cta-row" style={{ marginTop: "1.25rem" }}>
              <a
                className="btn btn-primary"
                href={getWhatsAppHref(copy.prefill)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.whatsapp}
              </a>
              <Link className="btn btn-ghost dark" href="/">
                {copy.home}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
