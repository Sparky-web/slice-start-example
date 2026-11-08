import { fail, ok, searchKey } from '@repo/lib'
import { createServerFn } from '@tanstack/react-start'

import { projectInputSchema } from '~/entities/project'
import { authMiddleware } from '~/shared/auth'
import { prisma } from '~/shared/db'

import type { CreateProjectError } from '../model/createProjectErrors.ts'
import { PROJECT_LIMIT } from '../model/createProjectErrors.ts'

/**
 * Создаёт проект пользователя. Пользователь становится владельцем.
 * Названия проектов одного пользователя не повторяются, число проектов ограничено.
 */
export const createProject = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(projectInputSchema)
  .handler(async ({ data, context }) => {
    const count = await prisma.project.count({ where: { ownerId: context.user.id } })
    if (count >= PROJECT_LIMIT) return fail<CreateProjectError>({ code: 'PROJECT_LIMIT_REACHED', params: { limit: PROJECT_LIMIT } })

    const nameKey = searchKey(data.name)
    const existing = await prisma.project.findFirst({ where: { ownerId: context.user.id, nameKey }, select: { id: true } })
    if (existing) return fail<CreateProjectError>({ code: 'DUPLICATE_NAME', field: 'name', params: { name: data.name } })

    const project = await prisma.project.create({ data: { ...data, nameKey, ownerId: context.user.id }, select: { id: true } })
    return ok(project)
  })
