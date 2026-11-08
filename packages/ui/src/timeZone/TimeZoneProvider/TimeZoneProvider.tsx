import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { TimeZoneContext } from '../timeZoneContext.ts'

/** Настройки часового пояса для страницы. */
export interface TimeZoneProviderProps {
  /** Пояс из настроек пользователя или сайта. Пустое значение означает пояс устройства. */
  timeZone: string | null
  /** Пояс устройства, который сервер узнал при прошлом визите. */
  deviceGuess: string
  /** Страница, на которой действует настройка. */
  children: ReactNode
}

/** Задаёт часовой пояс для всех дат и времени на странице. */
export function TimeZoneProvider({ timeZone, deviceGuess, children }: TimeZoneProviderProps) {
  const settings = useMemo(() => ({ timeZone, deviceGuess }), [timeZone, deviceGuess])
  return <TimeZoneContext value={settings}>{children}</TimeZoneContext>
}
