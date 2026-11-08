/**
 * Готовит работу с датами и временем по новому стандарту языка.
 * Браузеры и сервер без встроенной поддержки получают совместимую реализацию.
 * Современные браузеры ничего не скачивают.
 */
export async function ensureTemporal(): Promise<void> {
  if (!('Temporal' in globalThis)) await import('temporal-polyfill/global')
}
