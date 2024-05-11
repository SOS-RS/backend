import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const devDump = fs.readFileSync('./prisma/dev_dump.sql', 'utf-8');

  for (const query of devDump.split('\n')) {
    if (query.trim() === '') {
      continue;
    }

    // ignore prisma migrations at it is already applied by migrate command
    // if (query.includes('_prisma_migrations')) {
    // 	continue;
    // }

    try {
      await prisma.$executeRawUnsafe(query);
    } catch (e) {
      console.error(e);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
