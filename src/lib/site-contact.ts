/** Public contact details. Override WhatsApp via NEXT_PUBLIC_WHATSAPP_NUMBER (digits with country code). */
export const SITE_EMAIL = "mohamed.ketrani.zinati@gmail.com";

/** Digits only, e.g. 2126XXXXXXXX — update when you have the real number. */
const FALLBACK_WHATSAPP = "212600000000";

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
