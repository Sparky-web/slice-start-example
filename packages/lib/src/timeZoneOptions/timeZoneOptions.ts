/** Часовой пояс в списке выбора. */
export interface TimeZoneOption {
  /** Код часового пояса. */
  value: string
  /** Город и смещение от всемирного времени. */
  label: string
}

const offsetMinutes = (zone: string, now: Temporal.Instant) => now.toZonedDateTimeISO(zone).offsetNanoseconds / 60_000_000_000

/**
 * Все часовые пояса для выбора в настройках.
 * Пояса идут от западных к восточным, у каждого видно текущее смещение.
 */
export function timeZoneOptions(): TimeZoneOption[] {
  const now = Temporal.Now.instant()
  return Intl.supportedValuesOf('timeZone')
    .map((zone) => ({ zone, minutes: offsetMinutes(zone, now) }))
    .toSorted((a, b) => a.minutes - b.minutes || a.zone.localeCompare(b.zone))
    .map(({ zone }) => {
      const offset = now.toZonedDateTimeISO(zone).offset
      const city = zone.split('/').at(-1)?.replaceAll('_', ' ') ?? zone
      return { value: zone, label: `${city} (UTC${offset})` }
    })
}
