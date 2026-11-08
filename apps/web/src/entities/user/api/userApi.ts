import { createServerFn } from '@tanstack/react-start'

import { readSessionUser } from '~/shared/auth'

/** Current user or `null` for guests. Used by the root route to build the router context. */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(() => readSessionUser())
