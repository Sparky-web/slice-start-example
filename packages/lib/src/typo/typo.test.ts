import { describe, expect, it } from 'vitest'

import { typo } from './typo.ts'

const nbsp = ' '

describe('typo', () => {
  it('glues prepositions to the next word', () => {
    expect(typo('Задача в работе')).toBe(`Задача в${nbsp}работе`)
    expect(typo('по хорошему')).toBe(`по${nbsp}хорошему`)
  })

  it('handles chains of short words', () => {
    expect(typo('и в то же время')).toBe(`и${nbsp}в${nbsp}то${nbsp}же${nbsp}время`)
  })

  it('glues particles to the previous word', () => {
    expect(typo('Сделал бы сам')).toBe(`Сделал${nbsp}бы${nbsp}сам`)
  })

  it('uses a non-breaking hyphen after short prefixes', () => {
    expect(typo('по-хорошему')).toBe('по‑хорошему')
  })

  it('glues numbers to units and dashes to the previous word', () => {
    expect(typo('5 задач — готово')).toBe(`5${nbsp}задач${nbsp}— готово`)
  })

  it('is idempotent', () => {
    const once = typo('Работа в офисе по хорошему — 5 дней')
    expect(typo(once)).toBe(once)
  })

  it('keeps long words separated by regular spaces', () => {
    expect(typo('Проект запущен')).toBe('Проект запущен')
  })
})

describe('typo word list', () => {
  it('glues long prepositions but not ordinary short nouns', () => {
    expect(typo('Для всех')).toBe(`Для${nbsp}всех`)
    expect(typo('Имя пользователя')).toBe('Имя пользователя')
  })
})
