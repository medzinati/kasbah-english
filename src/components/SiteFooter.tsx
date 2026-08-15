import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <p>
            <strong>Kasbah English</strong> — community &amp; learning for Morocco &amp; the world.
          </p>
          <nav className="footer-links" aria-label="Footer">
            <Link href="/news">News</Link>
            <Link href="/courses">Free courses</Link>
            <Link href="/apply">Apply</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/members/login">Members</Link>
          </nav>
        </div>
        <p>© {new Date().getFullYear()} Kasbah English</p>
      </div>
    </footer>
  );
}
