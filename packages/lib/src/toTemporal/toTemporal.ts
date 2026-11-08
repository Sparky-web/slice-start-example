/** Момент времени, календарная дата или дата со временем: всё, что пользователь видит как дату. */
export type DateValue = string | Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate | Temporal.PlainDateTime

const PLAIN_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Приводит дату из базы или формы к единому виду.
 * Календарная дата без времени остаётся той же датой в любом часовом поясе.
 * Момент времени зависит от часового пояса, в котором пользователь смотрит на него.
 */
export function toTemporal(value: DateValue): Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate | Temporal.PlainDateTime {
  if (typeof value !== 'string') return value
  return PLAIN_DATE.test(value) ? Temporal.PlainDate.from(value) : Temporal.Instant.from(value)
}
