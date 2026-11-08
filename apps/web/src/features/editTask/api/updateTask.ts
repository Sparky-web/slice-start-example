import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { taskInputSchema, toTaskRecord } from '~/entities/task'
import { authMiddleware } from '~/shared/auth'
import { prisma } from '~/shared/db'

export const updateTask = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(taskInputSchema.extend({ id: z.string() }))
  .handler(async ({ data: { id, ...input }, context }) => {
    const { count } = await prisma.task.updateMany({
      where: { id, project: { ownerId: context.user.id } },
      data: toTaskRecord(input),
    })
    if (count === 0) throw new Error('Задача не найдена')
    return { id }
  })
