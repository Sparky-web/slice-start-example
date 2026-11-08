import type { DateFormat, DateValue } from '@repo/lib'
import { formatDate, toTemporal } from '@repo/lib'

import { useTimeZone } from '../../timeZone/timeZoneContext.ts'

/** Настройки даты. */
export interface DateTimeProps {
  /** Момент времени или календарная дата. */
  value: DateValue
  /** Вид даты: полная, короткая, со временем или только время. */
  preset?: DateFormat
}

/** Дата и время в часовом поясе пользователя. Поисковики и экранные дикторы понимают дату без разбора текста. */
export function DateTime({ value, preset = 'date' }: DateTimeProps) {
  const timeZone = useTimeZone()
  return <time dateTime={toTemporal(value).toString()}>{formatDate(value, { preset, timeZone })}</time>
}
