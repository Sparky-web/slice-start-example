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

export interface TypoPluginOptions {
  /** JSX attributes with human-readable text. */
  attributes?: readonly string[]
  /** Files to transform. */
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
  typeof value === 'object' && value !== null && typeof (value as { type?: unknown }).type === 'string'

const childNodes = (node: Node): Node[] =>
  Object.values(node).flatMap((value: unknown) => (Array.isArray(value) ? value.filter(isNode) : isNode(value) ? [value] : []))

function walk(node: Node, visit: (node: Node, parent: Node | undefined) => void, parent?: Node): void {
  visit(node, parent)
  for (const child of childNodes(node)) walk(child, visit, node)
}

const SENTINEL = '\uE000'

/** Replaces raw text with typographed text, keeping JSX whitespace rules intact. */
function typoJsxText(raw: string): string {
  const leading = /^\s*/.exec(raw)?.[0] ?? ''
  const trailing = /\s*$/.exec(raw)?.[0] ?? ''
  const body = raw.slice(leading.length, raw.length - trailing.length)
  if (!body) return raw
  // Whitespace with a newline at the edges is dropped by JSX, plain spaces are kept and may be glued.
  const glueTrailing = trailing.length > 0 && !trailing.includes('\n')
  if (!glueTrailing) return `${leading}${typo(body)}${trailing}`
  const glued = typo(`${body} ${SENTINEL}`)
  return `${leading}${glued.slice(0, -2)}${glued.at(-2) === '\u00A0' ? '\u00A0' : trailing}`
}

/**
 * Applies Russian typography (non-breaking spaces after prepositions, before particles, etc.)
 * to JSX text and human-readable string attributes at build time. Zero runtime cost.
 */
export function typoPlugin(options: TypoPluginOptions = {}): Plugin {
  const attributes = new Set<string>(options.attributes ?? DEFAULT_ATTRIBUTES)
  const include = options.include ?? /\/src\/.+\.tsx$/

  return {
    name: 'repo:typo',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0] ?? id
      if (!include.test(file) || file.includes('/node_modules/') || !/[А-Яа-яЁё]/.test(code)) return null

      const { program, errors } = parseSync(file, code, { lang: 'tsx', sourceType: 'module' })
      if (errors.length > 0) return null

      const output = new MagicString(code)
      walk(program as unknown as Node, (node, parent) => {
        if (node.type === 'JSXText') {
          const raw = code.slice(node.start, node.end)
          const next = typoJsxText(raw)
          if (next !== raw) output.overwrite(node.start, node.end, next)
          return
        }
        const isAttributeValue =
          parent?.type === 'JSXAttribute' &&
          isNode(parent['name']) &&
          attributes.has(String(parent['name']['name'])) &&
          isNode(parent['value']) && parent['value'].start === node.start
        const isChildExpression = parent?.type === 'JSXExpressionContainer'
        if (node.type === 'Literal' && typeof node['value'] === 'string' && (isAttributeValue || isChildExpression)) {
          const value = node['value']
          const next = typo(value)
          if (next !== value) output.overwrite(node.start, node.end, JSON.stringify(next))
        }
      })

      if (!output.hasChanged()) return null
      return { code: output.toString(), map: output.generateMap({ hires: 'boundary', source: file }) }
    },
  }
}
