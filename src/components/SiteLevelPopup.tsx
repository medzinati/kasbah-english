import { LevelTestPopup } from "@/components/LevelTestPopup";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/get-locale";

export async function SiteLevelPopup() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.levelPopup;

  return (
    <LevelTestPopup
      brand={dict.brand}
      title={p.title}
      text={p.text}
      cta={p.cta}
      dismiss={p.dismiss}
      close={p.close}
    />
  );
}
