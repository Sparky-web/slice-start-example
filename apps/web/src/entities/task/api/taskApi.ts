import type { DataPage } from '@repo/ui'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { authMiddleware } from '~/shared/auth'
import { PAGE_SIZE } from '~/shared/config'
import { prisma } from '~/shared/db'

import type { TaskListItem } from '../model/taskSchema.ts'
import { taskListSearchSchema } from '../model/taskSchema.ts'

const listTasksInput = taskListSearchSchema.extend({
  projectId: z.string(),
  cursor: z.string().nullable(),
})

/** A page of tasks of one project: offset cursor, filters and sorting run in the database. */
export const listTasks = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(listTasksInput)
  .handler(async ({ data, context }): Promise<DataPage<TaskListItem>> => {
    const offset = Number(data.cursor ?? 0)
    const where = {
      projectId: data.projectId,
      project: { ownerId: context.user.id },
      ...(data.status ? { status: data.status } : {}),
      ...(data.q ? { title: { contains: data.q, mode: 'insensitive' as const } } : {}),
    }
    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        orderBy: [{ [data.sort ?? 'createdAt']: data.desc === false ? 'asc' : 'desc' }, { id: 'asc' }],
        skip: offset,
        take: PAGE_SIZE,
      }),
      prisma.task.count({ where }),
    ])
    return {
      items: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate?.toISOString() ?? null,
        createdAt: task.createdAt.toISOString(),
      })),
      nextCursor: offset + PAGE_SIZE < total ? String(offset + PAGE_SIZE) : null,
      total,
    }
  })
