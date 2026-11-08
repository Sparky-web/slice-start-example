import { isTimeZone } from '@repo/lib'
import { DEVICE_TIME_ZONE_COOKIE } from '@repo/ui'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

/** Настройки показа дат, общие для всего сайта. */
export interface DisplaySettings {
  /** Часовой пояс сайта из настроек сервера. Пустое значение означает пояс устройства пользователя. */
  timeZone: string | null
  /** Пояс устройства, который браузер сообщил при прошлом визите. */
  deviceGuess: string
}

/**
 * Часовой пояс для дат на сайте.
 * Администратор задаёт пояс сайта в настройках сервера.
 * Без настройки сайт показывает даты в поясе устройства пользователя.
 */
export const getDisplaySettings = createServerFn({ method: 'GET' }).handler((): DisplaySettings => {
  const siteTimeZone = process.env['APP_TIME_ZONE']
  const deviceTimeZone = getCookie(DEVICE_TIME_ZONE_COOKIE)
  return {
    timeZone: isTimeZone(siteTimeZone) ? siteTimeZone : null,
    deviceGuess: isTimeZone(deviceTimeZone) ? deviceTimeZone : 'UTC',
  }
})
