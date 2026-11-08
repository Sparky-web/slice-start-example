import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { userNameSchema } from '~/entities/user'
import { authMiddleware } from '~/shared/auth'
import { prisma } from '~/shared/db'

export const updateProfile = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(z.object({ name: userNameSchema }))
  .handler(async ({ data, context }) => {
    await prisma.user.update({ where: { id: context.user.id }, data: { name: data.name } })
    return { name: data.name }
  })
