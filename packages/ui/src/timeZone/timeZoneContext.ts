import { deviceTimeZone } from '@repo/lib'
import { createContext, use, useSyncExternalStore } from 'react'

/** Настройка часового пояса для всего сайта. */
export interface TimeZoneSettings {
  /** Пояс из настроек пользователя или сайта. Пустое значение означает пояс устройства. */
  timeZone: string | null
  /** Пояс устройства, который сервер узнал при прошлом визите. Сервер показывает даты в нём до загрузки страницы. */
  deviceGuess: string
}

/** Настройка часового пояса, доступная любому компоненту страницы. */
export const TimeZoneContext = createContext<TimeZoneSettings>({ timeZone: null, deviceGuess: 'UTC' })

/** Имя cookie, в котором браузер сообщает серверу часовой пояс устройства. */
export const DEVICE_TIME_ZONE_COOKIE = 'tz'

/**
 * Скрипт для заголовка страницы: сохраняет часовой пояс устройства на год.
 * Со второго визита сервер сразу показывает даты в поясе пользователя.
 */
export const deviceTimeZoneScript = `document.cookie="${DEVICE_TIME_ZONE_COOKIE}="+encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone)+";path=/;max-age=31536000;samesite=lax"`

const subscribe = () => () => undefined

/**
 * Часовой пояс, в котором пользователь видит даты и время.
 * Без настройки пользователя и сайта действует пояс устройства.
 * Первая отрисовка совпадает с серверной, поэтому страница не мигает ошибкой.
 */
export function useTimeZone(): string {
  const { timeZone, deviceGuess } = use(TimeZoneContext)
  const device = useSyncExternalStore(subscribe, deviceTimeZone, () => deviceGuess)
  return timeZone ?? device
}
