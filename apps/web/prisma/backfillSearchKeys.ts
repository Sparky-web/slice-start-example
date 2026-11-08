/**
 * Заполняет ключи поиска у существующих проектов и задач.
 * Запуск: node --env-file=.env prisma/backfillSearchKeys.ts
 */
import { PrismaPg } from '@prisma/adapter-pg'
import { searchKey } from '@repo/lib'

import { PrismaClient } from '../src/shared/db/generated/client.ts'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }) })

for (const project of await prisma.project.findMany({ select: { id: true, name: true } })) {
  await prisma.project.update({ where: { id: project.id }, data: { nameKey: searchKey(project.name) } })
}
const tasks = await prisma.task.findMany({ select: { id: true, title: true } })
await prisma.$transaction(tasks.map((task) => prisma.task.update({ where: { id: task.id }, data: { titleKey: searchKey(task.title) } })))
console.log(`Backfilled ${String(tasks.length)} tasks`)
await prisma.$disconnect()
