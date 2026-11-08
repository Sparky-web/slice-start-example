import { createFileRoute } from '@tanstack/react-router'

import { HomePage, homePageQueries } from '~/pages/home'

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.query(homePageQueries.status()),
  head: () => ({
    meta: [
      { title: 'FSD Starter — TanStack Start, Prisma и дизайн-система' },
      { name: 'description', content: 'Базовый шаблон: SSR, сквозная типизация, FSD и строгий линтинг.' },
    ],
  }),
  component: HomePage,
})
