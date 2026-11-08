import { createFileRoute } from '@tanstack/react-router'

import { ProfilePage } from '~/pages/profile'

/** Профиль пользователя. */
export const Route = createFileRoute('/_authed/profile')({
  head: () => ({ meta: [{ title: 'Профиль — TaskFlow' }] }),
  component: ProfilePage,
})
