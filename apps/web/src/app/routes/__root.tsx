import { deviceTimeZoneScript, TimeZoneProvider } from '@repo/ui'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet, ScriptOnce,Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { NotFoundPage } from '~/pages/notFound'
import { getDisplaySettings } from '~/shared/api'

import appCss from '../styles/app.css?url'

/** Общие сервисы, доступные каждой странице. */
export interface RouterContext {
  /** Кэш данных страницы. */
  queryClient: QueryClient
}

/** Каркас всех страниц: заголовок документа, стили и часовой пояс для дат. */
export const Route = createRootRouteWithContext<RouterContext>()({
  loader: () => getDisplaySettings(),
  // Настройки показа меняются редко: страницы обновляют их явно после сохранения
  staleTime: Number.POSITIVE_INFINITY,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'FSD Starter' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})

function RootLayout() {
  const settings = Route.useLoaderData()
  return (
    <RootDocument>
      <TimeZoneProvider timeZone={settings.timeZone} deviceGuess={settings.deviceGuess}>
        <Outlet />
      </TimeZoneProvider>
    </RootDocument>
  )
}

/** Каркас документа. */
interface RootDocumentProps {
  /** Содержимое страницы. */
  children: ReactNode
}

function RootDocument({ children }: RootDocumentProps) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
        <ScriptOnce>{deviceTimeZoneScript}</ScriptOnce>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
