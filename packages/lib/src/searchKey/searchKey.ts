/**
 * Ключ для поиска и сравнения названий.
 * Регистр, буквы «ё» и «е» и лишние пробелы не важны.
 * Ключ не зависит от настроек языка базы данных.
 */
export function searchKey(text: string): string {
  return text.trim().replaceAll(/\s+/g, ' ').toLocaleLowerCase('ru-RU').replaceAll('ё', 'е')
}
