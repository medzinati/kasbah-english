import { dictionaries, type Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";

export const SITE_KEYS = {
  contact: "contact",
  homeHero: "home.hero",
  homeFaq: "home.faq",
  homeReviews: "home.reviews",
  about: "about",
  ops: "ops",
} as const;

export type ContactSettings = {
  email: string;
  whatsapp: string;
};

export type OpsSettings = {
  gaMeasurementId: string;
  defaultZoomUrl: string;
};

export type HomeHeroSettings = {
  headlineAr: string;
  headlineEn: string;
  ledeAr: string;
  ledeEn: string;
};

export type FaqItem = { qAr: string; qEn: string; aAr: string; aEn: string };

export type ReviewItem = {
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  quoteAr: string;
  quoteEn: string;
  photo: string;
};

export type AboutSettings = {
  heroAr: string;
  heroEn: string;
  ledeAr: string;
  ledeEn: string;
  story1Ar: string;
  story1En: string;
  story2Ar: string;
  story2En: string;
  story3Ar: string;
  story3En: string;
  values: { titleAr: string; titleEn: string; textAr: string; textEn: string }[];
};

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getSettingValue(key: string): Promise<string | null> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export async function getContactSettings(): Promise<ContactSettings> {
  const fallback: ContactSettings = {
    email: "mohamed.ketrani.zinati@gmail.com",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "212633288868",
  };
  return parseJson(await getSettingValue(SITE_KEYS.contact), fallback);
}

export async function getOpsSettings(): Promise<OpsSettings> {
  const fallback: OpsSettings = {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "",
    defaultZoomUrl: process.env.DEFAULT_ZOOM_URL?.trim() || "",
  };
  return parseJson(await getSettingValue(SITE_KEYS.ops), fallback);
}

export function isPlaceholderZoomUrl(url: string) {
  const u = url.trim().toLowerCase();
  return (
    !u ||
    u.includes("00000000000") ||
    u.includes("your-meeting") ||
    u.includes("example")
  );
}

export async function getPricingPlansFromDb() {
  try {
    return await prisma.pricingPlan.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function ensureDefaultPricingPlans() {
  const count = await prisma.pricingPlan.count();
  if (count > 0) return;

  const plans = dictionaries.ar.pricing.plans;
  const enPlans = dictionaries.en.pricing.plans;

  await prisma.pricingPlan.createMany({
    data: plans.map((plan, index) => {
      const en = enPlans[index];
      return {
        id: plan.id,
        nameAr: plan.name,
        nameEn: en.name,
        durationAr: plan.duration,
        durationEn: en.duration,
        priceSar: Number(plan.price),
        blurbAr: plan.blurb,
        blurbEn: en.blurb,
        badge: plan.badge || "",
        sortOrder: index,
        active: true,
      };
    }),
  });
}

type SiteDict = {
  home: {
    headline: string;
    lede: string;
    faq: { q: string; a: string }[];
    reviews: { name: string; country: string; quote: string }[];
    [key: string]: unknown;
  };
  about: {
    hero: string;
    lede: string;
    story1: string;
    story2: string;
    story3: string;
    values: { title: string; text: string }[];
    [key: string]: unknown;
  };
  pricing: {
    plans: {
      id: string;
      name: string;
      duration: string;
      price: string;
      blurb: string;
      badge: string;
    }[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export async function getSiteDictionary(locale: Locale): Promise<Dictionary> {
  const base = JSON.parse(JSON.stringify(dictionaries[locale])) as SiteDict;

  const [heroRaw, faqRaw, reviewsRaw, aboutRaw, plans] = await Promise.all([
    getSettingValue(SITE_KEYS.homeHero),
    getSettingValue(SITE_KEYS.homeFaq),
    getSettingValue(SITE_KEYS.homeReviews),
    getSettingValue(SITE_KEYS.about),
    getPricingPlansFromDb(),
  ]);

  const hero = parseJson<HomeHeroSettings | null>(heroRaw, null);
  if (hero) {
    base.home.headline = locale === "ar" ? hero.headlineAr : hero.headlineEn;
    base.home.lede = locale === "ar" ? hero.ledeAr : hero.ledeEn;
  }

  const faq = parseJson<FaqItem[] | null>(faqRaw, null);
  if (faq?.length) {
    base.home.faq = faq.map((item) => ({
      q: locale === "ar" ? item.qAr : item.qEn,
      a: locale === "ar" ? item.aAr : item.aEn,
    }));
  }

  const reviews = parseJson<ReviewItem[] | null>(reviewsRaw, null);
  if (reviews?.length) {
    base.home.reviews = reviews.map((item) => ({
      name: locale === "ar" ? item.nameAr : item.nameEn,
      country: locale === "ar" ? item.countryAr : item.countryEn,
      quote: locale === "ar" ? item.quoteAr : item.quoteEn,
    }));
  }

  const about = parseJson<AboutSettings | null>(aboutRaw, null);
  if (about) {
    base.about.hero = locale === "ar" ? about.heroAr : about.heroEn;
    base.about.lede = locale === "ar" ? about.ledeAr : about.ledeEn;
    base.about.story1 = locale === "ar" ? about.story1Ar : about.story1En;
    base.about.story2 = locale === "ar" ? about.story2Ar : about.story2En;
    base.about.story3 = locale === "ar" ? about.story3Ar : about.story3En;
    if (about.values?.length) {
      base.about.values = about.values.map((item) => ({
        title: locale === "ar" ? item.titleAr : item.titleEn,
        text: locale === "ar" ? item.textAr : item.textEn,
      }));
    }
  }

  if (plans.length) {
    base.pricing.plans = plans.map((plan) => ({
      id: plan.id,
      name: locale === "ar" ? plan.nameAr : plan.nameEn,
      duration: locale === "ar" ? plan.durationAr : plan.durationEn,
      price: String(plan.priceSar),
      blurb: locale === "ar" ? plan.blurbAr : plan.blurbEn,
      badge: plan.badge || "",
    }));
  }

  return base as unknown as Dictionary;
}

export async function getReviewPhotos(): Promise<string[]> {
  const reviews = parseJson<ReviewItem[] | null>(await getSettingValue(SITE_KEYS.homeReviews), null);
  if (reviews?.length) {
    return reviews.map((item) => item.photo || "/images/reviews/1.png");
  }
  return ["/images/reviews/1.png", "/images/reviews/2.png", "/images/reviews/3.png"];
}
