const rules = new Intl.PluralRules('ru-RU')

/**
 * Picks the Russian plural form for a number.
 *
 * @example pluralize(5, ['задача', 'задачи', 'задач']) // 'задач'
 */
export function pluralize(count: number, [one, few, many]: readonly [one: string, few: string, many: string]): string {
  switch (rules.select(count)) {
    case 'one': {
      return one
    }
    case 'few': {
      return few
    }
    default: {
      return many
    }
  }
}
