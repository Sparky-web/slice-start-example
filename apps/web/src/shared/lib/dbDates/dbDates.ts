/**
 * Календарная дата для записи в базу. База хранит её без времени.
 * Дата не сдвигается между часовыми поясами.
 */
export function toDbDate(date: Temporal.PlainDate | string): Date {
  const plain = typeof date === 'string' ? Temporal.PlainDate.from(date) : date
  // eslint-disable-next-line no-restricted-syntax -- база данных принимает только старый тип даты
  return new Date(plain.toZonedDateTime('UTC').epochMilliseconds)
}

/** Календарная дата из базы для показа и форм. */
export function fromDbDate(date: Date): string {
  return Temporal.Instant.fromEpochMilliseconds(date.getTime()).toZonedDateTimeISO('UTC').toPlainDate().toString()
}

/** Момент события из базы. Строка хранит точное время и понятна в любом часовом поясе. */
export function fromDbInstant(date: Date): string {
  return Temporal.Instant.fromEpochMilliseconds(date.getTime()).toString()
}

/** Момент события для записи в базу. */
export function toDbInstant(instant: Temporal.Instant): Date {
  // eslint-disable-next-line no-restricted-syntax -- база данных принимает только старый тип даты
  return new Date(instant.epochMilliseconds)
}
