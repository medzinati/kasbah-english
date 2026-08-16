import { SiteWhatsAppClient } from "@/components/SiteWhatsAppClient";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";

export async function SiteWhatsApp() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return <SiteWhatsAppClient label={dict.whatsapp.label} prefill={dict.whatsapp.prefill} />;
}
