type SiteHeaderProps = {
  variant?: "hero" | "solid";
};

const links = [
  { href: "/news", label: "News" },
  { href: "/courses", label: "Free courses" },
  { href: "/apply", label: "Apply" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ variant = "solid" }: SiteHeaderProps) {
  return (
    <header className={`nav ${variant === "solid" ? "nav-solid" : ""}`}>
      <div className="wrap nav-inner">
        <a className="logo" href="/">
          Kasbah <span>English</span>
        </a>
        <nav className="nav-links" aria-label="Main">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="/apply">
          Apply now
        </a>
      </div>
    </header>
  );
}
