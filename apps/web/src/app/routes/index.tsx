import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '~/pages/home'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'TaskFlow — задачи команды в одном месте' },
      { name: 'description', content: 'Проекты, задачи и сроки команды. Пример приложения на FSD Starter.' },
      { property: 'og:title', content: 'TaskFlow' },
      { property: 'og:description', content: 'Проекты, задачи и сроки команды.' },
    ],
  }),
  component: HomePage,
})
