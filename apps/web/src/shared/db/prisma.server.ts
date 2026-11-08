import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from './generated/client.ts'

declare global {
  // Одно подключение к базе переживает горячую перезагрузку в режиме разработки
  var prismaClient: PrismaClient | undefined
}

/** Подключение к базе данных. Работает только на сервере: браузерная сборка с ним не соберётся. */
export const prisma =
  globalThis.prismaClient ?? new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }) })

if (process.env['NODE_ENV'] !== 'production') globalThis.prismaClient = prisma
