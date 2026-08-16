import { hash } from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const defaultGroups = [
  {
    slug: "conversation",
    title: "مختبر المحادثة",
    description: "تمرين كلام ودّي للحياة اليومية — الطلاقة والوضوح والمواقف الحقيقية.",
  },
  {
    slug: "exam-track",
    title: "مسار الامتحانات",
    description: "دعم IELTS والإنجليزية الأكاديمية: استراتيجيات وأسئلة وتقدّم ثابت.",
  },
  {
    slug: "career-english",
    title: "إنجليزية العمل",
    description: "رسائل بريد إلكتروني واجتماعات ومقابلات وإنجليزية مهنية طبيعية ومحترفة.",
  },
  {
    slug: "general",
    title: "المجتمع العام",
    description: "تعارف وإنجازات وأسئلة ومحادثة دافئة مع متعلمي قصبة.",
  },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || "mohamed.ketrani.zinati@gmail.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "KasbahAdmin2026!";
  const name = process.env.ADMIN_NAME || "Kasbah Admin";

  const passwordHash = await hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email,
      name,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  for (const group of defaultGroups) {
    await prisma.discussionGroup.upsert({
      where: { slug: group.slug },
      update: {
        title: group.title,
        description: group.description,
      },
      create: {
        ...group,
        createdById: admin.id,
      },
    });
  }

  const welcomeTitle = "مرحبًا بك في قصبة إنجليش";
  const welcomeBody =
    "أنت الآن داخل المجتمع. اقرأ الإعلانات، وانضم إلى مجموعة نقاش، وقدّم نفسك، وتعال إلى لقاءات زوم مستعدًا للتحدّث. يسعدنا وجودك — التقدّم يحتاج إلى انتظام ولطف.";

  const existingWelcome = await prisma.announcement.findFirst({
    where: {
      OR: [
        { title: welcomeTitle },
        { title: "مرحبًا بك في كاسباه إنجليش" },
        { title: "Welcome to Kasbah English" },
        { title: "Welcome to the Kasbah English community" },
      ],
    },
  });

  if (existingWelcome) {
    await prisma.announcement.update({
      where: { id: existingWelcome.id },
      data: { title: welcomeTitle, body: welcomeBody, authorId: admin.id },
    });
  } else {
    await prisma.announcement.create({
      data: { title: welcomeTitle, body: welcomeBody, authorId: admin.id },
    });
  }

  const { newsItems } = await import("../src/data/news-items");
  for (const item of newsItems) {
    await prisma.newsPost.upsert({
      where: { slug: item.slug },
      update: {
        imageUrl: item.image,
        imageAltAr: item.imageAlt.ar,
        imageAltEn: item.imageAlt.en,
        titleAr: item.title.ar,
        titleEn: item.title.en,
        summaryAr: item.summary.ar,
        summaryEn: item.summary.en,
        bodyAr: JSON.stringify(item.body.ar),
        bodyEn: JSON.stringify(item.body.en),
        published: true,
        date: new Date(item.date),
      },
      create: {
        slug: item.slug,
        date: new Date(item.date),
        imageUrl: item.image,
        imageAltAr: item.imageAlt.ar,
        imageAltEn: item.imageAlt.en,
        titleAr: item.title.ar,
        titleEn: item.title.en,
        summaryAr: item.summary.ar,
        summaryEn: item.summary.en,
        bodyAr: JSON.stringify(item.body.ar),
        bodyEn: JSON.stringify(item.body.en),
        published: true,
        createdById: admin.id,
      },
    });
  }

  console.log(`Admin ready: ${email}`);
  console.log("Default discussion groups ready");
  console.log("News posts ready");
  console.log("Login at /members/login");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
