import { fail, ok } from '@repo/lib'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { findTaskByTitle, taskInputSchema, toTaskRecord } from '~/entities/task'
import { authMiddleware } from '~/shared/auth'
import { prisma } from '~/shared/db'

import type { UpdateTaskError } from '../model/updateTaskErrors.ts'

/** Сохраняет изменения задачи. Пользователь меняет только задачи своих проектов. Название в проекте не повторяется. */
export const updateTask = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(taskInputSchema.extend({ id: z.string() }))
  .handler(async ({ data: { id, ...input }, context }) => {
    const task = await prisma.task.findFirst({ where: { id, project: { ownerId: context.user.id } }, select: { projectId: true } })
    if (!task) return fail<UpdateTaskError>({ code: 'TASK_NOT_FOUND' })

    if (await findTaskByTitle({ projectId: task.projectId, title: input.title, exceptId: id })) {
      return fail<UpdateTaskError>({ code: 'DUPLICATE_TITLE', field: 'title', params: { title: input.title } })
    }

    await prisma.task.update({ where: { id }, data: toTaskRecord(input) })
    return ok({ id })
  })
