const CYRILLIC = /[А-Яа-яЁё]/g
const LATIN = /[A-Za-z]/g
const MAX_LATIN_SHARE = 0.3
/** Упрощённый технический русский: одно короткое предложение — одна мысль. */
const MAX_SENTENCE_WORDS = 20

/** Канцелярит и пустые слова, которые запрещает упрощённый технический русский. */
const BUREAUCRATIC = [
  'явля(ется|ются|ющ\\p{L}*)',
  'осуществля\\p{L}*',
  'производит(ся|ь)',
  'данн(ый|ая|ое|ого|ой|ому)',
  'посредством',
  'в рамках',
  'в целях',
  'с целью',
  'в связи с',
  'необходимо',
  'следует',
  'и т\\. ?[дп]\\.',
].map((word) => new RegExp(`(?<!\\p{L})${word}(?!\\p{L})`, 'iu'))

/** Признаки кода в тексте документации. */
const CODE_PATTERNS = [
  { pattern: /`/, what: 'обратные кавычки' },
  { pattern: /\{@link/, what: 'ссылка на код' },
  { pattern: /[A-Za-z_$][\w$]*\s*\(/, what: 'вызов функции' },
  { pattern: /=>|===|!==|&&|\|\|/, what: 'операторы' },
  { pattern: /\b[a-z]+[A-Z][A-Za-z0-9]*\b/, what: 'имя в camelCase' },
  { pattern: /\b[A-Z][a-z0-9]+[A-Z][A-Za-z0-9]*\b/, what: 'имя в PascalCase' },
  { pattern: /\b[A-Za-z]+_[A-Za-z0-9_]+\b/, what: 'имя в snake_case' },
  { pattern: /<[A-Za-z][\w.]*[\s/>]/, what: 'разметка' },
]

/** Текст блока без звёздочек, названий тегов и имён параметров. */
function proseOf(comment) {
  return comment.value
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .replace(/@param\s+(\{[^}]*\}\s*)?\[?[\w.$]+\]?/g, ' ')
    .replace(/@[a-zA-Z]+/g, ' ')
    .trim()
}

/** Имена переменных, функций, компонентов и импортов, объявленные в файле. */
function declaredNames(sourceCode) {
  const names = new Set()
  for (const scope of sourceCode.scopeManager?.scopes ?? []) {
    for (const variable of scope.variables) {
      if (/[A-Za-z]/.test(variable.name) && variable.name.length > 1) names.add(variable.name)
    }
  }
  return names
}

/**
 * JSDoc пишется по-русски и объясняет продуктовый смысл:
 * без кода, имён переменных, компонентов и примеров использования.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const jsdocProduct = {
  meta: {
    type: 'suggestion',
    docs: { description: 'JSDoc на русском языке с продуктовым смыслом, без кода и имён из кода' },
    schema: [],
    messages: {
      language: 'JSDoc пишется на русском языке: опишите, зачем это пользователю или бизнесу.',
      code: 'В JSDoc не должно быть кода ({{what}}). Опишите продуктовый смысл, а не реализацию.',
      identifier: 'В JSDoc упомянуто имя из кода «{{name}}». Опишите продуктовый смысл без названий переменных и компонентов.',
      example: 'Примеры кода в JSDoc запрещены: показывайте использование в историях Storybook и тестах.',
      longSentence: 'Предложение длиннее {{max}} слов. Упрощённый технический русский: одно короткое предложение — одна мысль.',
      bureaucratic: 'Канцелярит «{{word}}». Пишите на упрощённом техническом русском: прямо и в действительном залоге.',
      empty: 'JSDoc не может быть пустым: опишите продуктовый смысл.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode
    /** Первая найденная проблема текста документации или пустое значение. */
    const problemOf = (prose, names) => {
      if (!prose) return { messageId: 'empty' }
      const code = CODE_PATTERNS.find(({ pattern }) => pattern.test(prose))
      if (code) return { messageId: 'code', data: { what: code.what } }
      const mentioned = prose.match(/[A-Za-z_$][\w$]*/g)?.find((word) => names.has(word))
      if (mentioned) return { messageId: 'identifier', data: { name: mentioned } }
      const long = prose
        .split(/[.!?;]+/)
        .some((sentence) => sentence.split(/\s+/).filter((word) => /[\p{L}\d]/u.test(word)).length > MAX_SENTENCE_WORDS)
      if (long) return { messageId: 'longSentence', data: { max: String(MAX_SENTENCE_WORDS) } }
      const bureaucratic = BUREAUCRATIC.map((pattern) => pattern.exec(prose)?.[0]).find(Boolean)
      if (bureaucratic) return { messageId: 'bureaucratic', data: { word: bureaucratic } }
      const cyrillic = prose.match(CYRILLIC)?.length ?? 0
      const latin = prose.match(LATIN)?.length ?? 0
      return cyrillic === 0 || latin / (cyrillic + latin) > MAX_LATIN_SHARE ? { messageId: 'language' } : undefined
    }

    return {
      'Program:exit'() {
        const names = declaredNames(sourceCode)
        const docs = sourceCode.getAllComments().filter((comment) => comment.type === 'Block' && comment.value.startsWith('*'))
        for (const comment of docs) {
          if (/@example\b/.test(comment.value)) context.report({ loc: comment.loc, messageId: 'example' })
          const problem = problemOf(proseOf(comment), names)
          if (problem) context.report({ loc: comment.loc, ...problem })
        }
      },
    }
  },
}
