import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { SignInPage } from '~/pages/signIn'

export const Route = createFileRoute('/sign-in')({
  validateSearch: z.object({
    // Only same-origin paths, never an absolute URL
    redirect: z.string().regex(/^\/(?!\/)/).optional().catch(undefined),
  }),
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: '/projects' })
  },
  head: () => ({ meta: [{ title: 'Вход — TaskFlow' }] }),
  component: SignInPage,
})
