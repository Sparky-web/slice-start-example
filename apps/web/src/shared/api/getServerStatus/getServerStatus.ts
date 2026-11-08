import { createServerFn } from '@tanstack/react-start'

import { prisma } from '~/shared/db'

export interface ServerStatus {
  database: 'ok' | 'error'
  checkedAt: string
}

/** Example of a server function: runs on the server, typed end to end on the client. */
export const getServerStatus = createServerFn({ method: 'GET' }).handler(async (): Promise<ServerStatus> => {
  const checkedAt = new Date().toISOString()
  try {
    await prisma.$queryRaw`SELECT 1`
    return { database: 'ok', checkedAt }
  } catch {
    return { database: 'error', checkedAt }
  }
})
