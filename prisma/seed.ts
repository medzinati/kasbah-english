import { hash } from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const defaultGroups = [
  {
    slug: "conversation",
    title: "Conversation Lab",
    description: "Friendly speaking practice for everyday life — fluency, clarity, and real situations.",
  },
  {
    slug: "exam-track",
    title: "Exam Track",
    description: "IELTS and academic English support: strategies, questions, and steady progress.",
  },
  {
    slug: "career-english",
    title: "Career English",
    description: "Emails, meetings, interviews, and workplace English that sounds natural and professional.",
  },
  {
    slug: "general",
    title: "General Community",
    description: "Introductions, wins, questions, and warm conversation with fellow Kasbah learners.",
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

  const welcomeTitle = "Welcome to Kasbah English";
  const welcomeBody =
    "You’re inside. Read announcements, join a discussion group, introduce yourself, and come to live Zoom meetings ready to speak. We’re glad you’re here — progress loves consistency and kindness.";

  const existingWelcome = await prisma.announcement.findFirst({
    where: {
      OR: [{ title: welcomeTitle }, { title: "Welcome to the Kasbah English community" }],
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

  console.log(`Admin ready: ${email}`);
  console.log("Default discussion groups ready");
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
