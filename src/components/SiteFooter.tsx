import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import type { Dictionary } from "@/i18n/dictionaries";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label={dict.brand}>
            <BrandLogo size="footer" alt={dict.brand} />
          </Link>
          <p>{dict.footer.tagline}</p>
          <nav className="footer-links" aria-label={dict.footer.links}>
            <Link href="/about">{dict.nav.about}</Link>
            <Link href="/news">{dict.nav.news}</Link>
            <Link href="/courses">{dict.nav.courses}</Link>
            <Link href="/level-test">{dict.nav.levelTest}</Link>
            <Link href="/pricing">{dict.nav.pricing}</Link>
            <Link href="/apply">{dict.nav.apply}</Link>
            <Link href="/contact">{dict.nav.contact}</Link>
            <Link href="/members/login">{dict.nav.members}</Link>
          </nav>
        </div>
        <p>
          © {new Date().getFullYear()} {dict.brand}
        </p>
      </div>
    </footer>
  );
}
