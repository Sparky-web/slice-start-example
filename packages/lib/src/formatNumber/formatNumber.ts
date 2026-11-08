const formatters = new Map<string, Intl.NumberFormat>()

/**
 * Formats a number for the Russian locale with cached Intl formatters.
 *
 * @example formatNumber(1234.5) // '1 234,5'
 * @example formatNumber(1500, { style: 'currency', currency: 'RUB' }) // '1 500 ₽'
 */
export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  const key = JSON.stringify(options)
  let formatter = formatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, ...options })
    formatters.set(key, formatter)
  }
  return formatter.format(value)
}
