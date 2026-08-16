import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  /** nav | hero | footer | mark */
  size?: "nav" | "hero" | "footer" | "mark";
  alt?: string;
};

const sizes = {
  nav: { width: 148, height: 148, className: "brand-logo-img brand-logo-nav" },
  hero: { width: 280, height: 280, className: "brand-logo-img brand-logo-hero" },
  footer: { width: 120, height: 120, className: "brand-logo-img brand-logo-footer" },
  mark: { width: 40, height: 40, className: "brand-logo-img brand-logo-mark" },
} as const;

export function BrandLogo({
  className = "",
  priority = false,
  size = "nav",
  alt = "Kasbah English",
}: BrandLogoProps) {
  const cfg = sizes[size];
  return (
    <span className={`brand-logo ${className}`.trim()}>
      <Image
        src="/images/kasbah-logo.png"
        alt={alt}
        width={cfg.width}
        height={cfg.height}
        className={cfg.className}
        priority={priority}
        sizes={size === "hero" ? "(max-width: 640px) 180px, 260px" : size === "nav" ? "120px" : "100px"}
      />
    </span>
  );
}
