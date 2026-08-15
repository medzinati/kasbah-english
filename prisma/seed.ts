import { hash } from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const defaultGroups = [
  {
    slug: "conversation",
    title: "Conversation Lab",
    description: "Practice everyday speaking, fluency, and real-life situations.",
  },
  {
    slug: "exam-track",
    title: "Exam Track",
    description: "IELTS and academic English tips, questions, and study plans.",
  },
  {
    slug: "career-english",
    title: "Career English",
    description: "Emails, meetings, interviews, and workplace English.",
  },
  {
    slug: "general",
    title: "General Community",
    description: "Introductions, wins, questions, and anything Kasbah English.",
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

  const existingWelcome = await prisma.announcement.findFirst({
    where: { title: "Welcome to the Kasbah English community" },
  });

  if (!existingWelcome) {
    await prisma.announcement.create({
      data: {
        title: "Welcome to the Kasbah English community",
        body: "This is your members space. Read announcements here, join discussion groups, and share practice with other learners. Meetings with Zoom links come next.",
        authorId: admin.id,
      },
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
