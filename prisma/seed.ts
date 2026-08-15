import { hash } from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "mohamed.ketrani.zinati@gmail.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "KasbahAdmin2026!";
  const name = process.env.ADMIN_NAME || "Kasbah Admin";

  const passwordHash = await hash(password, 10);

  await prisma.user.upsert({
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

  console.log(`Admin ready: ${email}`);
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
