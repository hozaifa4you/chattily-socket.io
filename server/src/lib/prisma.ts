import { PrismaClient } from '../../generated/prisma';

declare global {
   var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
   prisma = new PrismaClient();
} else {
   if (!global.cachedPrisma) {
      global.cachedPrisma = new PrismaClient({
         log: ['error', 'warn'],
      });
   }
   prisma = global.cachedPrisma;
}

export { prisma };
