/** Public contact details. Override WhatsApp via NEXT_PUBLIC_WHATSAPP_NUMBER (digits with country code). */
export const SITE_EMAIL = "mohamed.ketrani.zinati@gmail.com";

/** Digits only with country code (no +). */
const FALLBACK_WHATSAPP = "212633288868";

export function getWhatsAppNumber(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";
  return fromEnv || FALLBACK_WHATSAPP;
}

export function getWhatsAppHref(prefill?: string): string {
  const number = getWhatsAppNumber();
  const base = `https://wa.me/${number}`;
  if (!prefill) return base;
  return `${base}?text=${encodeURIComponent(prefill)}`;
}
