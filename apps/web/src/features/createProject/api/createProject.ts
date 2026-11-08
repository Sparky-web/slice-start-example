import { createServerFn } from '@tanstack/react-start'

import { projectInputSchema } from '~/entities/project'
import { authMiddleware } from '~/shared/auth'
import { prisma } from '~/shared/db'

export const createProject = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(projectInputSchema)
  .handler(async ({ data, context }) => {
    const project = await prisma.project.create({ data: { ...data, ownerId: context.user.id }, select: { id: true } })
    return project
  })
