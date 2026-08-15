"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Locale } from "@/i18n/config";

export function LanguageSwitcher({
  locale,
  labelAr,
  labelEn,
}: {
  locale: Locale;
  labelAr: string;
  labelEn: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === locale || pending) return;
    startTransition(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    });
  }

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      <button
        type="button"
        className={locale === "ar" ? "is-active" : ""}
        disabled={pending}
        onClick={() => setLocale("ar")}
      >
        {labelAr}
      </button>
      <span aria-hidden="true">|</span>
      <button
        type="button"
        className={locale === "en" ? "is-active" : ""}
        disabled={pending}
        onClick={() => setLocale("en")}
      >
        {labelEn}
      </button>
    </div>
  );
}
