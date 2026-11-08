import { describe, expect, it } from 'vitest'

import { typoPlugin } from './typoPlugin.ts'

const nbsp = ' '

function transform(code: string): string {
  const plugin = typoPlugin()
  const hook = plugin.transform as (code: string, id: string) => { code: string } | null
  return hook(code, '/project/src/pages/Home.tsx')?.code ?? code
}

describe('typoPlugin', () => {
  it('typographs JSX text', () => {
    expect(transform('const a = <p>Задачи в работе</p>')).toBe(`const a = <p>Задачи в${nbsp}работе</p>`)
  })

  it('glues a preposition to the following expression', () => {
    expect(transform('const a = <p>Проект в {name}</p>')).toBe(`const a = <p>Проект в${nbsp}{name}</p>`)
  })

  it('keeps multiline JSX whitespace semantics', () => {
    const code = 'const a = (\n  <p>\n    Задачи в\n    {name}\n  </p>\n)'
    expect(transform(code)).toBe(code)
  })

  it('typographs human-readable attributes only', () => {
    expect(transform('const a = <Input label="Имя и фамилия" name="и фамилия" />')).toBe(
      `const a = <Input label="Имя и${nbsp}фамилия" name="и фамилия" />`,
    )
  })

  it('skips files without cyrillic text', () => {
    expect(transform('const a = <p>Hello in world</p>')).toBe('const a = <p>Hello in world</p>')
  })
})
