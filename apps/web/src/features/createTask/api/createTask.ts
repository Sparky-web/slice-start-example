import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { taskInputSchema, toTaskRecord } from '~/entities/task'
import { authMiddleware } from '~/shared/auth'
import { prisma } from '~/shared/db'

export const createTask = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(taskInputSchema.extend({ projectId: z.string() }))
  .handler(async ({ data: { projectId, ...input }, context }) => {
    const project = await prisma.project.findFirst({ where: { id: projectId, ownerId: context.user.id }, select: { id: true } })
    if (!project) throw new Error('Проект не найден')
    return prisma.task.create({ data: { ...toTaskRecord(input), projectId }, select: { id: true } })
  })
