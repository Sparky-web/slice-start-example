/** Проверяет, что строка — существующий часовой пояс. Защищает от ошибок в настройках и подмены данных. */
export function isTimeZone(value: unknown): value is string {
  if (typeof value !== 'string' || value === '') return false
  try {
    Intl.DateTimeFormat('ru-RU', { timeZone: value })
    return true
  } catch {
    return false
  }
}
