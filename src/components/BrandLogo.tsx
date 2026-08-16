type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  size?: "nav" | "hero" | "footer" | "mark";
  alt?: string;
};

const sizes = {
  nav: "brand-logo-img brand-logo-nav",
  hero: "brand-logo-img brand-logo-hero",
  footer: "brand-logo-img brand-logo-footer",
  mark: "brand-logo-img brand-logo-mark",
} as const;

export function BrandLogo({
  className = "",
  priority = false,
  size = "nav",
  alt = "Kasbah English",
}: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`.trim()}>
      {/* Plain img so the logo always loads from /public without optimizer quirks */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/kasbah-logo.png"
        alt={alt}
        className={sizes[size]}
        width={size === "hero" ? 280 : size === "footer" ? 120 : 148}
        height={size === "hero" ? 280 : size === "footer" ? 120 : 148}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
      />
    </span>
  );
}
