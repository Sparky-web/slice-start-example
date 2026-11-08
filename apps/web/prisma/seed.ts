/**
 * Demo data: user demo@taskflow.dev / demo12345, 40 projects, 1200 tasks in the first one.
 * Run: pnpm --filter web db:seed
 */
import { PrismaPg } from '@prisma/adapter-pg'
import { ensureTemporal, searchKey } from '@repo/lib'
import { generateId } from 'better-auth'
import { hashPassword } from 'better-auth/crypto'

import { PrismaClient } from '../src/shared/db/generated/client.ts'
import { toDbDate, toDbInstant } from '../src/shared/lib/dbDates/dbDates.ts'

await ensureTemporal()

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }) })

const EMAIL = 'demo@taskflow.dev'
const PASSWORD = 'demo12345'
const statuses = ['TODO', 'IN_PROGRESS', 'DONE'] as const satisfies readonly string[]
const priorities = ['LOW', 'MEDIUM', 'HIGH'] as const
const verbs: [string, ...string[]] = ['Сверстать', 'Проверить', 'Согласовать', 'Описать', 'Починить', 'Обновить', 'Протестировать', 'Задеплоить']
const objects: [string, ...string[]] = ['главную страницу', 'форму входа', 'отчёт по продажам', 'API заказов', 'тарифы', 'онбординг', 'уведомления', 'поиск']
const projectNames: [string, ...string[]] = ['Редизайн сайта', 'Мобильное приложение', 'CRM для отдела продаж', 'Личный кабинет', 'Маркетинг Q1', 'Аналитика', 'Интеграция с 1С', 'Найм разработчиков']

const pick = <T,>(items: readonly [T, ...T[]], index: number): T => items[index % items.length] ?? items[0]
const now = Temporal.Now.instant()
const today = Temporal.Now.plainDateISO()

await prisma.user.deleteMany({ where: { email: EMAIL } })
const userId = generateId()
await prisma.user.create({
  data: {
    id: userId,
    name: 'Демо Пользователь',
    email: EMAIL,
    emailVerified: true,
    accounts: { create: { id: generateId(), accountId: userId, providerId: 'credential', password: await hashPassword(PASSWORD) } },
  },
})

for (let index = 0; index < 40; index += 1) {
  const taskCount = index === 0 ? 1200 : (index * 7) % 45
  const name = index < projectNames.length ? pick(projectNames, index) : `${pick(projectNames, index)} ${String(Math.floor(index / projectNames.length) + 1)}`
  const project = await prisma.project.create({
    data: { name, nameKey: searchKey(name), description: `Демо-проект №${String(index + 1)}`, ownerId: userId, createdAt: toDbInstant(now.subtract({ hours: index * 24 })) },
  })
  await prisma.task.createMany({
    data: Array.from({ length: taskCount }, (_, task) => {
      const title = `${pick(verbs, task)} ${pick(objects, task * 3 + index)} #${String(task + 1)}`
      return {
        projectId: project.id,
        title,
        titleKey: searchKey(title),
        status: pick(statuses, task * 5 + index),
        priority: pick(priorities, task * 2 + index),
        dueDate: task % 4 === 0 ? null : toDbDate(today.add({ days: (task % 60) - 20 })),
        createdAt: toDbInstant(now.subtract({ hours: task })),
      }
    }),
  })
}

console.log(`Seeded ${EMAIL} / ${PASSWORD}`)
await prisma.$disconnect()
