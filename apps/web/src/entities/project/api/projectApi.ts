import { searchKey } from '@repo/lib'
import type { ListPage } from '@repo/ui'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { authMiddleware } from '~/shared/auth'
import { prisma } from '~/shared/db'
import { fromDbInstant, listRequestSchema, pageArgs } from '~/shared/lib'

import type { ProjectListItem } from '../model/projectSchema.ts'
import { projectFiltersSchema, projectSortFields } from '../model/projectSchema.ts'

async function countDone(projectIds: string[]): Promise<Map<string, number>> {
  const groups = await prisma.task.groupBy({
    by: ['projectId'],
    where: { projectId: { in: projectIds }, status: 'DONE' },
    _count: { _all: true },
  })
  return new Map(groups.map((group) => [group.projectId, group._count._all]))
}

/**
 * Проекты пользователя порциями для грида.
 * Пользователь видит только свои проекты и ищет их по названию.
 */
export const listProjects = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(listRequestSchema(projectFiltersSchema))
  .handler(async ({ data, context }): Promise<ListPage<ProjectListItem>> => {
    const where = {
      ownerId: context.user.id,
      ...(data.filters.name ? { nameKey: { contains: searchKey(data.filters.name) } } : {}),
    }
    const [rows, total] = await prisma.$transaction([
      prisma.project.findMany({
        where,
        ...pageArgs(data, projectSortFields, 'createdAt'),
        include: { _count: { select: { tasks: true } } },
      }),
      prisma.project.count({ where }),
    ])
    const done = await countDone(rows.map((project) => project.id))
    const items = rows.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      taskCount: project._count.tasks,
      doneCount: done.get(project.id) ?? 0,
      createdAt: fromDbInstant(project.createdAt),
    }))
    return { items, total }
  })

/** Проект пользователя со счётчиками задач. Чужой проект выглядит как несуществующий. */
export const getProject = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }): Promise<ProjectListItem> => {
    const project = await prisma.project.findFirst({
      where: { id: data.id, ownerId: context.user.id },
      include: { _count: { select: { tasks: true } } },
    })
    if (!project) throw notFound()
    const done = await countDone([project.id])
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      taskCount: project._count.tasks,
      doneCount: done.get(project.id) ?? 0,
      createdAt: fromDbInstant(project.createdAt),
    }
  })
