import { PrismaClient } from "@prisma/client";
import { getMaxListeners } from "process";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: {
      name: "Rahul",
    },
  });

  console.log(user);
}

main()
  .catch((e) => console.error(e.message))
  .finally(async () => {
    await prisma.$disconnect();
  });
