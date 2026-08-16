import { SiteWhatsAppClient } from "@/components/SiteWhatsAppClient";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";
import { getSiteContact } from "@/lib/site-contact";

export async function SiteWhatsApp() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const contact = await getSiteContact();
  return (
    <SiteWhatsAppClient
      label={dict.whatsapp.label}
      prefill={dict.whatsapp.prefill}
      number={contact.whatsapp}
    />
  );
}
