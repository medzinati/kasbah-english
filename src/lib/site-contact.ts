import { getContactSettings } from "@/lib/site-content";

/** Digits only with country code (no +). Sync fallback for client components. */
const FALLBACK_WHATSAPP = "212633288868";
const FALLBACK_EMAIL = "mohamed.ketrani.zinati@gmail.com";

export const SITE_EMAIL = FALLBACK_EMAIL;

export function getWhatsAppNumber(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";
  return fromEnv || FALLBACK_WHATSAPP;
}

export function getWhatsAppHref(prefill?: string, numberOverride?: string): string {
  const number = numberOverride || getWhatsAppNumber();
  const base = `https://wa.me/${number}`;
  if (!prefill) return base;
  return `${base}?text=${encodeURIComponent(prefill)}`;
}

export async function getSiteContact() {
  const settings = await getContactSettings();
  return {
    email: settings.email || FALLBACK_EMAIL,
    whatsapp: settings.whatsapp || getWhatsAppNumber(),
  };
}
