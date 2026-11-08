import type { ListPage } from '@repo/ui'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { authMiddleware } from '~/shared/auth'
import { prisma } from '~/shared/db'
import { fromDbDate, fromDbInstant, listRequestSchema, pageArgs, toDbDate } from '~/shared/lib'

import type { TaskInput, TaskListItem } from '../model/taskSchema.ts'
import { taskFiltersSchema, taskSortFields } from '../model/taskSchema.ts'

/** Строка задачи из базы в виде для таблицы и форм. */
interface TaskRow {
  id: string
  title: string
  description: string
  status: TaskListItem['status']
  priority: TaskListItem['priority']
  dueDate: Date | null
  createdAt: Date
}

/** Задача из базы в виде для таблицы и форм. */
export const toTaskItem = (task: TaskRow): TaskListItem => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate ? fromDbDate(task.dueDate) : null,
  createdAt: fromDbInstant(task.createdAt),
})

/** Значения формы задачи для записи в базу. */
export const toTaskRecord = (input: TaskInput) => ({
  title: input.title,
  description: input.description,
  status: input.status,
  priority: input.priority,
  dueDate: input.dueDate ? toDbDate(input.dueDate) : null,
})

/**
 * Задачи проекта порциями для таблицы.
 * Пользователь видит только задачи своих проектов.
 * Отбор и порядок выполняет база, поэтому список работает быстро на тысячах задач.
 */
export const listTasks = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(listRequestSchema(taskFiltersSchema).extend({ projectId: z.string() }))
  .handler(async ({ data, context }): Promise<ListPage<TaskListItem>> => {
    const where = {
      projectId: data.projectId,
      project: { ownerId: context.user.id },
      ...(data.filters.status ? { status: data.filters.status } : {}),
      ...(data.filters.q ? { title: { contains: data.filters.q, mode: 'insensitive' as const } } : {}),
    }
    const [rows, total] = await prisma.$transaction([
      prisma.task.findMany({ where, ...pageArgs(data, taskSortFields, 'createdAt') }),
      prisma.task.count({ where }),
    ])
    return { items: rows.map(toTaskItem), total }
  })
