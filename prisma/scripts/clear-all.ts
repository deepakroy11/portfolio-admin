import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete in correct order (respect FK constraints)
  await prisma.postTaxonomy.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.taxonomyMeta.deleteMany({});
  await prisma.taxonomy.deleteMany({});
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "Session" REPLICA IDENTITY FULL;`
  );
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.authenticator.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✅ All data deleted.");
}

main()
  .catch((e) => {
    console.error("❌ Error deleting data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
