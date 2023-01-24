import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ log: ["query"] });

async function main() {
  // REPL LIKE here...
}

main()
  .catch((e) => console.error(e.message))
  .finally(async () => {
    await prisma.$disconnect();
  });
