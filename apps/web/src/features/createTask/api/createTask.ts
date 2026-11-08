import { fail, ok } from '@repo/lib'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { findTaskByTitle, taskInputSchema, toTaskRecord } from '~/entities/task'
import { authMiddleware } from '~/shared/auth'
import { prisma } from '~/shared/db'

import type { CreateTaskError } from '../model/createTaskErrors.ts'

/**
 * Добавляет задачу в проект пользователя.
 * В чужой проект задачу добавить нельзя.
 * Название в проекте не повторяется, срок не уходит в прошлое.
 */
export const createTask = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(taskInputSchema.extend({ projectId: z.string() }))
  .handler(async ({ data: { projectId, ...input }, context }) => {
    const project = await prisma.project.findFirst({ where: { id: projectId, ownerId: context.user.id }, select: { id: true } })
    if (!project) return fail<CreateTaskError>({ code: 'PROJECT_NOT_FOUND' })

    if (await findTaskByTitle({ projectId, title: input.title })) {
      return fail<CreateTaskError>({ code: 'DUPLICATE_TITLE', field: 'title', params: { title: input.title } })
    }

    const today = Temporal.Now.plainDateISO(context.user.timeZone ?? 'UTC')
    if (input.dueDate && Temporal.PlainDate.compare(input.dueDate, today) < 0) {
      return fail<CreateTaskError>({ code: 'DUE_DATE_IN_PAST', field: 'dueDate', params: { today: today.toString() } })
    }

    const task = await prisma.task.create({ data: { ...toTaskRecord(input), projectId }, select: { id: true } })
    return ok(task)
  })
