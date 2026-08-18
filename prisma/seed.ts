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
    slug: "speaking-cafe",
    title: "Speaking Café",
    description: "غرفة speaking أسبوعية: مواضيع خفيفة، تصحيح لطيف، وكل شخص يتكلّم.",
  },
  {
    slug: "pronunciation",
    title: "مختبر النطق",
    description: "وضوح الصوت، الإيقاع، والكلمات الصعبة — تدريب قصير ومركّز.",
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

const starterPosts: Array<{
  groupSlug: string;
  title: string;
  body: string;
}> = [
  {
    groupSlug: "speaking-cafe",
    title: "قدّم نفسك بالإنجليزية (دقيقتان)",
    body: "اكتب 4–6 جمل: اسمك، مدينتك، لماذا تتعلّم الإنجليزية، وهدف هذا الشهر. سنعلّق ونشجّع بعضنا.",
  },
  {
    groupSlug: "conversation",
    title: "موضوع الأسبوع: يوم عمل عادي",
    body: "صف يومك بالإنجليزية. ركّز على الماضي البسيط والحاضر. لا بأس بالأخطاء — المهم أن تتدرّب.",
  },
  {
    groupSlug: "pronunciation",
    title: "كلمة هذا الأسبوع: comfortable",
    body: "سجّل أو اكتب كيف تنطقها، وشارك جملة تستخدمها فيها. سنصحّح بلطف.",
  },
  {
    groupSlug: "general",
    title: "مرحبًا في مجتمع القصبة",
    body: "إذا كنت عضوًا جديدًا: قل مرحبًا، اذكر مستواك التقريبي، والمجموعة التي تريد البدء بها.",
  },
];

function nextThursdayAt19Gulf(): Date {
  const now = new Date();
  const gulfOffsetMs = 3 * 60 * 60 * 1000;
  const gulfNow = new Date(now.getTime() + gulfOffsetMs);
  const day = gulfNow.getUTCDay(); // 0 Sun .. 4 Thu
  let addDays = (4 - day + 7) % 7;
  if (addDays === 0 && gulfNow.getUTCHours() >= 19) addDays = 7;
  const targetGulf = new Date(
    Date.UTC(gulfNow.getUTCFullYear(), gulfNow.getUTCMonth(), gulfNow.getUTCDate() + addDays, 19, 0, 0),
  );
  return new Date(targetGulf.getTime() - gulfOffsetMs);
}

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

  for (const post of starterPosts) {
    const group = await prisma.discussionGroup.findUnique({ where: { slug: post.groupSlug } });
    if (!group) continue;
    const exists = await prisma.discussionPost.findFirst({
      where: { groupId: group.id, title: post.title },
    });
    if (exists) {
      await prisma.discussionPost.update({
        where: { id: exists.id },
        data: { body: post.body, authorId: admin.id },
      });
    } else {
      await prisma.discussionPost.create({
        data: {
          groupId: group.id,
          authorId: admin.id,
          title: post.title,
          body: post.body,
        },
      });
    }
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

  const meetingAnnounceTitle = "لقاء Speaking مباشر هذا الأسبوع";
  const meetingAnnounceBody =
    "انضم إلى لقاء Zoom للمحادثة. افتح جدول اللقاءات، سجّل حضورك، وادخل قبل الموعد بدقائق. جهّز جملتين تتحدّث بهما عن يومك.";
  const existingMeetingAnnounce = await prisma.announcement.findFirst({
    where: { title: meetingAnnounceTitle },
  });
  if (existingMeetingAnnounce) {
    await prisma.announcement.update({
      where: { id: existingMeetingAnnounce.id },
      data: { body: meetingAnnounceBody, authorId: admin.id },
    });
  } else {
    await prisma.announcement.create({
      data: {
        title: meetingAnnounceTitle,
        body: meetingAnnounceBody,
        authorId: admin.id,
      },
    });
  }

  const meetingTitle = "Speaking Café — Live Zoom";
  const meetingStartsAt = nextThursdayAt19Gulf();
  const zoomUrl =
    process.env.DEFAULT_ZOOM_URL?.trim() || "https://zoom.us/j/00000000000";
  const existingMeeting = await prisma.meeting.findFirst({
    where: { title: meetingTitle, startsAt: { gte: new Date() } },
  });
  if (existingMeeting) {
    await prisma.meeting.update({
      where: { id: existingMeeting.id },
      data: {
        description:
          "لقاء محادثة مفتوح لكل الأعضاء. موضوع خفيف + تصحيح لطيف. حدّث رابط Zoom من لوحة الإدارة إن لزم.",
        startsAt: meetingStartsAt,
        durationMinutes: 60,
        zoomUrl,
        createdById: admin.id,
      },
    });
  } else {
    await prisma.meeting.create({
      data: {
        title: meetingTitle,
        description:
          "لقاء محادثة مفتوح لكل الأعضاء. موضوع خفيف + تصحيح لطيف. حدّث رابط Zoom من لوحة الإدارة إن لزم.",
        startsAt: meetingStartsAt,
        durationMinutes: 60,
        zoomUrl,
        createdById: admin.id,
      },
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
  console.log("Discussion groups + starter posts ready");
  console.log("Announcements + upcoming Zoom meeting ready");
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
