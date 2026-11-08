import { createFileRoute, redirect } from '@tanstack/react-router'

import { SignUpPage } from '~/pages/signUp'

/** Регистрация. Пользователь с активным входом сразу попадает к проектам. */
export const Route = createFileRoute('/sign-up')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: '/projects' })
  },
  head: () => ({ meta: [{ title: 'Регистрация — TaskFlow' }] }),
  component: SignUpPage,
})
