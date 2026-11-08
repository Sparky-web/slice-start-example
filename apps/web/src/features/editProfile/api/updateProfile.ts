import { fail, ok } from '@repo/lib'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { DEVICE_TIME_ZONE, userNameSchema, userTimeZoneSchema } from '~/entities/user'
import { authMiddleware } from '~/shared/auth'
import { prisma } from '~/shared/db'

import type { UpdateProfileError } from '../model/updateProfileErrors.ts'
import { RESERVED_NAMES } from '../model/updateProfileErrors.ts'

/** Поля профиля, которые пользователь меняет сам. */
export const profileSchema = z.object({ name: userNameSchema, timeZone: userTimeZoneSchema })

/** Сохраняет имя и часовой пояс пользователя. Даты на сайте сразу переходят в новый пояс. */
export const updateProfile = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(profileSchema)
  .handler(async ({ data, context }) => {
    if (RESERVED_NAMES.some((reserved) => reserved === data.name.toLowerCase())) {
      return fail<UpdateProfileError>({ code: 'NAME_RESERVED', field: 'name', params: { name: data.name } })
    }
    const timeZone = data.timeZone === DEVICE_TIME_ZONE ? null : data.timeZone
    await prisma.user.update({ where: { id: context.user.id }, data: { name: data.name, timeZone } })
    return ok({ name: data.name, timeZone })
  })
