const formatters = new Map<string, Intl.NumberFormat>()

/** Показывает число по-русски: с пробелами между разрядами и запятой перед дробной частью. Подходит для денег и процентов. */
export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  const key = JSON.stringify(options)
  let formatter = formatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, ...options })
    formatters.set(key, formatter)
  }
  return formatter.format(value)
}
