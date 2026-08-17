export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://www.kasbahenglish.com";
  return raw.replace(/\/$/, "");
}
