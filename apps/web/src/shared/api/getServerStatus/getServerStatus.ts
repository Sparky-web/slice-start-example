import { createServerFn } from '@tanstack/react-start'

import { prisma } from '~/shared/db'

/** Состояние сервера для главной страницы шаблона. */
export interface ServerStatus {
  /** База данных отвечает или недоступна. */
  database: 'ok' | 'error'
  /** Момент проверки. */
  checkedAt: string
}

/** Проверяет, что сайт видит базу данных. Помогает убедиться, что шаблон настроен верно. */
export const getServerStatus = createServerFn({ method: 'GET' }).handler(async (): Promise<ServerStatus> => {
  const checkedAt = Temporal.Now.instant().toString()
  try {
    await prisma.$queryRaw`SELECT 1`
    return { database: 'ok', checkedAt }
  } catch {
    return { database: 'error', checkedAt }
  }
})
