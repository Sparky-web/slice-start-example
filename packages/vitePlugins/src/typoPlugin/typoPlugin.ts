import { typo } from '@repo/lib'
import MagicString from 'magic-string'
import { parseSync } from 'oxc-parser'
import type { Plugin } from 'vite'

interface Node {
  type: string
  start: number
  end: number
  [key: string]: unknown
}

/** Настройки типографики при сборке. */
export interface TypoPluginOptions {
  /** Свойства элементов, в которых лежит текст для людей: подписи, подсказки, заголовки. */
  attributes?: readonly string[]
  /** Какие файлы обрабатывать. */
  include?: RegExp
}

const DEFAULT_ATTRIBUTES = [
  'alt',
  'aria-label',
  'description',
  'emptyDescription',
  'emptyTitle',
  'label',
  'placeholder',
  'title',
] as const

const isNode = (value: unknown): value is Node =>
  typeof value === 'object' && value !== null && 'type' in value && typeof value.type === 'string'

const childNodes = (node: Node): Node[] =>
  Object.values(node).flatMap((value: unknown) => (Array.isArray(value) ? value.filter(isNode) : isNode(value) ? [value] : []))

function walk(node: Node, visit: (node: Node, parent: Node | undefined) => void, parent?: Node): void {
  visit(node, parent)
  for (const child of childNodes(node)) walk(child, visit, node)
}

const SENTINEL = ''

// Пробелы с переносом строки по краям текста разметка отбрасывает, обычные пробелы остаются и склеиваются
function typoJsxText(raw: string): string {
  const leading = /^\s*/.exec(raw)?.[0] ?? ''
  const trailing = /\s*$/.exec(raw)?.[0] ?? ''
  const body = raw.slice(leading.length, raw.length - trailing.length)
  if (!body) return raw
  const glueTrailing = trailing.length > 0 && !trailing.includes('\n')
  if (!glueTrailing) return `${leading}${typo(body)}${trailing}`
  const glued = typo(`${body} ${SENTINEL}`)
  return `${leading}${glued.slice(0, -2)}${glued.at(-2) === ' ' ? ' ' : trailing}`
}

function isHumanText(node: Node, parent: Node | undefined, attributes: ReadonlySet<string>): boolean {
  if (node.type !== 'Literal' || typeof node['value'] !== 'string') return false
  if (parent?.type === 'JSXExpressionContainer') return true
  const name = parent?.['name']
  const value = parent?.['value']
  return (
    parent?.type === 'JSXAttribute' &&
    isNode(name) &&
    attributes.has(String(name['name'])) &&
    isNode(value) &&
    value.start === node.start
  )
}

/**
 * Расставляет неразрывные пробелы в русском тексте страниц при сборке. Файлы без русского текста не меняются.
 * Возвращает исправленный код или пустое значение, если менять нечего.
 */
export function transformTypo(code: string, file: string, attributes: ReadonlySet<string> = new Set(DEFAULT_ATTRIBUTES)) {
  if (!/[А-Яа-яЁё]/.test(code)) return null
  const { program, errors } = parseSync(file, code, { lang: 'tsx', sourceType: 'module' })
  if (errors.length > 0 || !isNode(program)) return null

  const output = new MagicString(code)
  walk(program, (node, parent) => {
    if (node.type === 'JSXText') {
      const raw = code.slice(node.start, node.end)
      const next = typoJsxText(raw)
      if (next !== raw) output.overwrite(node.start, node.end, next)
    } else if (isHumanText(node, parent, attributes)) {
      const value = String(node['value'])
      const next = typo(value)
      if (next !== value) output.overwrite(node.start, node.end, JSON.stringify(next))
    }
  })

  if (!output.hasChanged()) return null
  return { code: output.toString(), map: output.generateMap({ hires: 'boundary', source: file }) }
}

/**
 * Русская типографика во всём тексте интерфейса без затрат при работе страницы.
 * Предлоги и союзы не остаются в конце строки ни в тексте, ни в подписях полей.
 */
export function typoPlugin(options: TypoPluginOptions = {}): Plugin {
  const attributes = new Set<string>(options.attributes ?? DEFAULT_ATTRIBUTES)
  const include = options.include ?? /\/src\/.+\.tsx$/

  return {
    name: 'repo:typo',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0] ?? id
      if (!include.test(file) || file.includes('/node_modules/')) return null
      return transformTypo(code, file, attributes)
    },
  }
}
