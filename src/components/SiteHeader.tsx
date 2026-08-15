"use client";

import Link from "next/link";
import { useState } from "react";

type SiteHeaderProps = {
  variant?: "hero" | "solid";
};

const links = [
  { href: "/news", label: "News" },
  { href: "/courses", label: "Free courses" },
  { href: "/apply", label: "Apply" },
  { href: "/contact", label: "Contact" },
  { href: "/members/login", label: "Members" },
];

export function SiteHeader({ variant = "solid" }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className={`nav ${variant === "solid" ? "nav-solid" : ""} ${open ? "is-open" : ""}`}>
      <div className="wrap nav-inner">
        <Link className="logo" href="/" onClick={close}>
          Kasbah <span>English</span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link className="nav-cta" href="/apply" onClick={close}>
            Apply now
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
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
            Apply to join
          </Link>
        </div>
      </div>
    </header>
  );
}
