const NBSP = ' '
const NB_HYPHEN = '‑'

const LETTER = 'A-Za-zА-Яа-яЁё'
const LONG_PREPOSITIONS = 'без|безо|для|изо|меж|над|надо|обо|ото|перед|передо|под|подо|при|про|через|или|как|что|чем|где|когда'
const SHORT_WORD = new RegExp(
  `(^|[\\s(«„"'\\u00A0])([${LETTER}]{1,2}|${LONG_PREPOSITIONS})[ \\t\\n\\r]+(?=[^\\s])`,
  'gi',
)
const PARTICLE = new RegExp(`([${LETTER}0-9])[ \\t\\n\\r]+(ли|ль|же|ж|бы|б)(?=$|[\\s.,!?:;…)»])`, 'gi')
const SHORT_PREFIX = new RegExp(`(^|[\\s(«„"'\\u00A0])(по|во|из|кое|кой|из-за)-([${LETTER}])`, 'gi')
const NUMBER_UNIT = /(\d)[ \t]+(?=[^\s\d—–-])/g
const DASH = /[ \t]+(—|–)(?=\s)/g

/**
 * Russian typography: keeps short words (prepositions, conjunctions, particles),
 * numbers and dashes glued to their neighbours so they never stay alone at a line end.
 * Idempotent, safe to apply repeatedly.
 *
 * @example typo('Работа в офисе') // 'Работа в\u00A0офисе'
 */
export function typo(text: string): string {
  return text
    // Twice: a chain of short words ("и в то же") shares separators between matches
    .replace(SHORT_WORD, `$1$2${NBSP}`)
    .replace(SHORT_WORD, `$1$2${NBSP}`)
    .replace(PARTICLE, `$1${NBSP}$2`)
    .replace(SHORT_PREFIX, `$1$2${NB_HYPHEN}$3`)
    .replace(NUMBER_UNIT, `$1${NBSP}`)
    .replace(DASH, `${NBSP}$1`)
}
