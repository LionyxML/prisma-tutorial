import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({});

  const user = await prisma.user.create({
    data: {
      name: "Rahul",
      age: 36,
      email: "rahul@test.com",
      isAdmin: true,
      userPreference: { create: { emailUpdate: true } },
    },
    include: {
      userPreference: true,
    },
  });

  console.log(user);
}

main()
  .catch((e) => console.error(e.message))
  .finally(async () => {
    await prisma.$disconnect();
  });
