import { createServerFn } from '@tanstack/react-start'

import { readSessionUser } from '~/shared/auth'

/** Пользователь, который сейчас на сайте. Гость получает пустое значение. */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(() => readSessionUser())
