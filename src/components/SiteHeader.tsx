import Link from "next/link";

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
  return (
    <header className={`nav ${variant === "solid" ? "nav-solid" : ""}`}>
      <div className="wrap nav-inner">
        <Link className="logo" href="/">
          Kasbah <span>English</span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="nav-cta" href="/apply">
          Apply now
        </Link>
      </div>
    </header>
  );
}
