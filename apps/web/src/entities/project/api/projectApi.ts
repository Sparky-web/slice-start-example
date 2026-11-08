import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { authMiddleware } from '~/shared/auth'
import type { Prisma } from '~/shared/db'
import { prisma } from '~/shared/db'

import type { ProjectListItem } from '../model/projectSchema.ts'
import { projectListInputSchema } from '../model/projectSchema.ts'

async function countDone(projectIds: string[]): Promise<Map<string, number>> {
  const groups = await prisma.task.groupBy({
    by: ['projectId'],
    where: { projectId: { in: projectIds }, status: 'DONE' },
    _count: { _all: true },
  })
  return new Map(groups.map((group) => [group.projectId, group._count._all]))
}

/** A block of the current user's projects for the projects grid. */
export const listProjects = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(projectListInputSchema)
  .handler(async ({ data, context }): Promise<{ items: ProjectListItem[]; total: number }> => {
    const where = {
      ownerId: context.user.id,
      ...(data.search ? { name: { contains: data.search, mode: 'insensitive' as const } } : {}),
    }
    const direction: Prisma.SortOrder = data.desc ? 'desc' : 'asc'
    const orderBy: Prisma.ProjectOrderByWithRelationInput =
      data.sort === 'taskCount' ? { tasks: { _count: direction } } : { [data.sort]: direction }
    const [projects, total] = await prisma.$transaction([
      prisma.project.findMany({
        where,
        orderBy: [orderBy, { id: 'asc' }],
        skip: data.offset,
        take: data.limit,
        include: { _count: { select: { tasks: true } } },
      }),
      prisma.project.count({ where }),
    ])
    const done = await countDone(projects.map((project) => project.id))
    const items = projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      taskCount: project._count.tasks,
      doneCount: done.get(project.id) ?? 0,
      createdAt: project.createdAt.toISOString(),
    }))
    return { items, total }
  })

/** One project of the current user with task counters. Throws `notFound` for foreign ids. */
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
      createdAt: project.createdAt.toISOString(),
    }
  })
