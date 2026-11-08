const rules = new Intl.PluralRules('ru-RU')

/** Выбирает форму слова для числа: одна задача, две задачи, пять задач. */
export function pluralize(count: number, [one, few, many]: readonly [one: string, few: string, many: string]): string {
  switch (rules.select(count)) {
    case 'one': {
      return one
    }
    case 'few': {
      return few
    }
    case 'two':
    case 'zero':
    case 'many':
    case 'other': {
      return many
    }
  }
}
