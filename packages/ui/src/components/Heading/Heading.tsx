import { typo } from '@repo/lib'
import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'

const headingVariants = cva('font-semibold text-foreground', {
  variants: {
    level: {
      1: 'text-3xl font-bold sm:text-4xl',
      2: 'text-2xl',
      3: 'text-xl',
      4: 'text-lg',
    },
  },
})

/** Настройки заголовка. */
export interface HeadingProps {
  /** Уровень заголовка в структуре страницы. Уровень задаёт и размер. */
  level: 1 | 2 | 3 | 4
  /** Текст заголовка. */
  children: ReactNode
  /** Редкое исключение для раскладки на странице. */
  className?: string
  /** Якорь для ссылки на раздел страницы. */
  id?: string
}

/** Заголовок раздела страницы. Поисковики и экранные дикторы видят структуру страницы по заголовкам. */
export function Heading({ level, children, className, id }: HeadingProps) {
  const Tag = (['h1', 'h2', 'h3', 'h4'] as const)[level - 1] ?? 'h2'
  return (
    <Tag id={id} className={cn(headingVariants({ level }), className)}>
      {typeof children === 'string' ? typo(children) : children}
    </Tag>
  )
}
