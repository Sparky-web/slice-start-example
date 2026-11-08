import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from './generated/client.ts'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

/** Single Prisma client. Server-only: importing it into client code fails the build. */
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }) })

if (process.env['NODE_ENV'] !== 'production') globalForPrisma.prisma = prisma
