import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  SITE_KEYS,
  ensureDefaultPricingPlans,
  type AboutSettings,
  type ContactSettings,
  type FaqItem,
  type HomeHeroSettings,
  type OpsSettings,
  type ReviewItem,
  isPlaceholderZoomUrl,
} from "@/lib/site-content";
import { dictionaries } from "@/i18n/dictionaries";

async function requireAdminApi() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

async function upsertSetting(key: string, value: unknown) {
  const raw = JSON.stringify(value);
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: raw },
    update: { value: raw },
  });
}

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function GET() {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  await ensureDefaultPricingPlans();

  const [contactRow, heroRow, faqRow, reviewsRow, aboutRow, opsRow, plans] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: SITE_KEYS.contact } }),
    prisma.siteSetting.findUnique({ where: { key: SITE_KEYS.homeHero } }),
    prisma.siteSetting.findUnique({ where: { key: SITE_KEYS.homeFaq } }),
    prisma.siteSetting.findUnique({ where: { key: SITE_KEYS.homeReviews } }),
    prisma.siteSetting.findUnique({ where: { key: SITE_KEYS.about } }),
    prisma.siteSetting.findUnique({ where: { key: SITE_KEYS.ops } }),
    prisma.pricingPlan.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const ar = dictionaries.ar;
  const en = dictionaries.en;

  const contact = parseJson<ContactSettings>(contactRow?.value, {
    email: "mohamed.ketrani.zinati@gmail.com",
    whatsapp: "212633288868",
  });

  const homeHero = parseJson<HomeHeroSettings>(heroRow?.value, {
    headlineAr: ar.home.headline,
    headlineEn: en.home.headline,
    ledeAr: ar.home.lede,
    ledeEn: en.home.lede,
  });

  const faq = parseJson<FaqItem[]>(
    faqRow?.value,
    ar.home.faq.map((item, i) => ({
      qAr: item.q,
      qEn: en.home.faq[i].q,
      aAr: item.a,
      aEn: en.home.faq[i].a,
    })),
  );

  const reviews = parseJson<ReviewItem[]>(
    reviewsRow?.value,
    ar.home.reviews.map((item, i) => ({
      nameAr: item.name,
      nameEn: en.home.reviews[i].name,
      countryAr: item.country,
      countryEn: en.home.reviews[i].country,
      quoteAr: item.quote,
      quoteEn: en.home.reviews[i].quote,
      photo: `/images/reviews/${i + 1}.png`,
    })),
  );

  const about = parseJson<AboutSettings>(aboutRow?.value, {
    heroAr: ar.about.hero,
    heroEn: en.about.hero,
    ledeAr: ar.about.lede,
    ledeEn: en.about.lede,
    story1Ar: ar.about.story1,
    story1En: en.about.story1,
    story2Ar: ar.about.story2,
    story2En: en.about.story2,
    story3Ar: ar.about.story3,
    story3En: en.about.story3,
    values: ar.about.values.map((item, i) => ({
      titleAr: item.title,
      titleEn: en.about.values[i].title,
      textAr: item.text,
      textEn: en.about.values[i].text,
    })),
  });

  const ops = parseJson<OpsSettings>(opsRow?.value, {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "",
    defaultZoomUrl: process.env.DEFAULT_ZOOM_URL?.trim() || "",
  });

  return NextResponse.json({
    ok: true,
    contact,
    homeHero,
    faq,
    reviews,
    about,
    ops,
    plans,
  });
}

const contactSchema = z.object({
  email: z.string().trim().email(),
  whatsapp: z.string().trim().min(8),
});

const heroSchema = z.object({
  headlineAr: z.string().trim().min(2),
  headlineEn: z.string().trim().min(2),
  ledeAr: z.string().trim().min(2),
  ledeEn: z.string().trim().min(2),
});

const faqSchema = z.array(
  z.object({
    qAr: z.string().trim().min(2),
    qEn: z.string().trim().min(2),
    aAr: z.string().trim().min(2),
    aEn: z.string().trim().min(2),
  }),
);

const reviewsSchema = z.array(
  z.object({
    nameAr: z.string().trim().min(2),
    nameEn: z.string().trim().min(2),
    countryAr: z.string().trim().min(2),
    countryEn: z.string().trim().min(2),
    quoteAr: z.string().trim().min(2),
    quoteEn: z.string().trim().min(2),
    photo: z.string().trim().min(1),
  }),
);

const aboutSchema = z.object({
  heroAr: z.string().trim().min(2),
  heroEn: z.string().trim().min(2),
  ledeAr: z.string().trim().min(2),
  ledeEn: z.string().trim().min(2),
  story1Ar: z.string().trim().min(2),
  story1En: z.string().trim().min(2),
  story2Ar: z.string().trim().min(2),
  story2En: z.string().trim().min(2),
  story3Ar: z.string().trim().min(2),
  story3En: z.string().trim().min(2),
  values: z.array(
    z.object({
      titleAr: z.string().trim().min(2),
      titleEn: z.string().trim().min(2),
      textAr: z.string().trim().min(2),
      textEn: z.string().trim().min(2),
    }),
  ),
});

const plansSchema = z.array(
  z.object({
    id: z.string().trim().min(1),
    nameAr: z.string().trim().min(2),
    nameEn: z.string().trim().min(2),
    durationAr: z.string().trim().min(1),
    durationEn: z.string().trim().min(1),
    priceSar: z.number().int().positive(),
    blurbAr: z.string().trim().min(2),
    blurbEn: z.string().trim().min(2),
    badge: z.string(),
    sortOrder: z.number().int(),
    active: z.boolean(),
  }),
);

const opsSchema = z.object({
  gaMeasurementId: z.string().trim(),
  defaultZoomUrl: z.string().trim(),
});

const putSchema = z.object({
  contact: contactSchema.optional(),
  homeHero: heroSchema.optional(),
  faq: faqSchema.optional(),
  reviews: reviewsSchema.optional(),
  about: aboutSchema.optional(),
  plans: plansSchema.optional(),
  ops: opsSchema.optional(),
});

export async function PUT(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "بيانات غير صالحة." }, { status: 400 });
  }

  const data = parsed.data;

  try {
    if (data.contact) await upsertSetting(SITE_KEYS.contact, data.contact);
    if (data.homeHero) await upsertSetting(SITE_KEYS.homeHero, data.homeHero);
    if (data.faq) await upsertSetting(SITE_KEYS.homeFaq, data.faq);
    if (data.reviews) await upsertSetting(SITE_KEYS.homeReviews, data.reviews);
    if (data.about) await upsertSetting(SITE_KEYS.about, data.about);
    if (data.ops) {
      const ga = data.ops.gaMeasurementId.trim();
      if (ga && !/^G-[A-Z0-9]+$/i.test(ga)) {
        return NextResponse.json(
          { ok: false, error: "معرّف Analytics يجب أن يكون مثل G-XXXXXXXX." },
          { status: 400 },
        );
      }
      const zoom = data.ops.defaultZoomUrl.trim();
      if (zoom) {
        try {
          new URL(zoom);
        } catch {
          return NextResponse.json({ ok: false, error: "رابط Zoom غير صالح." }, { status: 400 });
        }
      }
      await upsertSetting(SITE_KEYS.ops, {
        gaMeasurementId: ga,
        defaultZoomUrl: zoom,
      });

      if (zoom && !isPlaceholderZoomUrl(zoom)) {
        const upcoming = await prisma.meeting.findMany({
          where: { startsAt: { gte: new Date() } },
          select: { id: true, zoomUrl: true },
        });
        for (const meeting of upcoming) {
          if (isPlaceholderZoomUrl(meeting.zoomUrl)) {
            await prisma.meeting.update({
              where: { id: meeting.id },
              data: { zoomUrl: zoom },
            });
          }
        }
      }
    }

    if (data.plans) {
      for (const plan of data.plans) {
        await prisma.pricingPlan.upsert({
          where: { id: plan.id },
          create: plan,
          update: {
            nameAr: plan.nameAr,
            nameEn: plan.nameEn,
            durationAr: plan.durationAr,
            durationEn: plan.durationEn,
            priceSar: plan.priceSar,
            blurbAr: plan.blurbAr,
            blurbEn: plan.blurbEn,
            badge: plan.badge,
            sortOrder: plan.sortOrder,
            active: plan.active,
          },
        });
      }
    }
  } catch (error) {
    console.error("Admin site save error", error);
    return NextResponse.json({ ok: false, error: "تعذّر الحفظ." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
