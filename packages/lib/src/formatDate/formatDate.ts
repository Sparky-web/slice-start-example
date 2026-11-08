import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const patterns = {
  date: 'd MMMM yyyy',
  short: 'dd.MM.yyyy',
  dateTime: 'd MMMM yyyy, HH:mm',
  time: 'HH:mm',
} as const

export type DateFormat = keyof typeof patterns

/**
 * Formats a date with one of the project-wide presets (Russian locale).
 *
 * @example formatDate(new Date(2026, 0, 5)) // '5 января 2026'
 */
export function formatDate(value: Date | string | number, preset: DateFormat = 'date'): string {
  return format(new Date(value), patterns[preset], { locale: ru })
}
