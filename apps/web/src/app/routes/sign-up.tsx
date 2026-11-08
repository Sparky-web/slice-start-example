import { createFileRoute, redirect } from '@tanstack/react-router'

import { SignUpPage } from '~/pages/signUp'

export const Route = createFileRoute('/sign-up')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: '/projects' })
  },
  head: () => ({ meta: [{ title: 'Регистрация — TaskFlow' }] }),
  component: SignUpPage,
})
