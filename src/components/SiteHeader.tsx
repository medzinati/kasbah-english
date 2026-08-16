"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type SiteHeaderProps = {
  variant?: "hero" | "solid";
  locale: Locale;
  dict: Dictionary;
};

export function SiteHeader({ variant = "solid", locale, dict }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/about", label: dict.nav.about },
    { href: "/news", label: dict.nav.news },
    { href: "/courses", label: dict.nav.courses },
    { href: "/level-test", label: dict.nav.levelTest },
    { href: "/pricing", label: dict.nav.pricing },
    { href: "/apply", label: dict.nav.apply },
    { href: "/contact", label: dict.nav.contact },
    { href: "/members/login", label: dict.nav.members },
  ];

  function close() {
    setOpen(false);
  }

  return (
    <header className={`nav ${variant === "solid" ? "nav-solid" : ""} ${open ? "is-open" : ""}`}>
      <div className="wrap nav-inner">
        <Link className="logo" href="/" onClick={close}>
          {dict.brandShort} <span>{dict.brandAccent}</span>
        </Link>

        <nav className="nav-links" aria-label={dict.nav.mainNav}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <LanguageSwitcher locale={locale} labelAr={dict.lang.ar} labelEn={dict.lang.en} />
          <Link className="nav-cta" href="/apply" onClick={close}>
            {dict.nav.applyNow}
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={`mobile-nav ${open ? "is-open" : ""}`}>
        <div className="wrap mobile-nav-inner">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={close}>
              {link.label}
            </Link>
          ))}
          <Link className="btn btn-primary mobile-nav-cta" href="/apply" onClick={close}>
            {dict.nav.joinUs}
          </Link>
        </div>
      </div>
    </header>
  );
}
