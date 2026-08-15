export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <p>
            <strong>Kasbah English</strong> — community &amp; learning for Morocco &amp; the world.
          </p>
          <nav className="footer-links" aria-label="Footer">
            <a href="/news">News</a>
            <a href="/courses">Free courses</a>
            <a href="/apply">Apply</a>
            <a href="/contact">Contact</a>
            <a href="/members/login">Members</a>
          </nav>
        </div>
        <p>© {new Date().getFullYear()} Kasbah English</p>
      </div>
    </footer>
  );
}
