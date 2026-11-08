import type { DateValue } from '../toTemporal/toTemporal.ts'
import { toTemporal } from '../toTemporal/toTemporal.ts'

const presets = {
  date: { day: 'numeric', month: 'long', year: 'numeric' },
  short: { day: '2-digit', month: '2-digit', year: 'numeric' },
  dateTime: { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  time: { hour: '2-digit', minute: '2-digit' },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

/** Вид даты: полная дата, короткая дата, дата со временем или только время. */
export type DateFormat = keyof typeof presets

/** Как показать дату пользователю. */
export interface FormatDateOptions {
  /** Вид даты. */
  preset?: DateFormat
  /** Часовой пояс, в котором пользователь смотрит на дату. */
  timeZone: string
}

/**
 * Показывает дату по-русски в часовом поясе пользователя.
 * Календарная дата без времени не сдвигается между часовыми поясами.
 */
export function formatDate(value: DateValue, { preset = 'date', timeZone }: FormatDateOptions): string {
  const date = toTemporal(value)
  if (date instanceof Temporal.PlainDate) {
    return date.toLocaleString('ru-RU', preset === 'short' ? presets.short : presets.date)
  }
  const zoned = date instanceof Temporal.Instant ? date.toZonedDateTimeISO(timeZone) : date
  return zoned.toLocaleString('ru-RU', presets[preset])
}
