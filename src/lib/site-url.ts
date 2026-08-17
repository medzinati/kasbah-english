/**
 * Canonical public site URL for SEO (sitemap, robots, Open Graph).
 * Always prefer www — Search Console property is https://www.kasbahenglish.com
 */
export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://www.kasbahenglish.com";

  try {
    const url = new URL(raw);
    if (url.hostname === "kasbahenglish.com") {
      url.hostname = "www.kasbahenglish.com";
    }
    // Drop path/query — origin only
    return url.origin;
  } catch {
    return "https://www.kasbahenglish.com";
  }
}
