export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";
export const localeCookie = "kasbah_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ar" || value === "en";
}

export function brandName(locale: Locale) {
  return locale === "ar" ? "قصبة إنجليش" : "Kasbah English";
}
