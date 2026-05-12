import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prismaInstance?: PrismaClient };

export const prisma = globalForPrisma.prismaInstance ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaInstance = prisma;
}

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
