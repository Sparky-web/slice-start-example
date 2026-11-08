import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '../../lib/cn/cn.ts'

const stackVariants = cva('flex min-w-0', {
  variants: {
    direction: { column: 'flex-col', row: 'flex-row', responsive: 'flex-col sm:flex-row' },
    gap: { 0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4', 6: 'gap-6', 8: 'gap-8', 12: 'gap-12' },
    align: { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch', baseline: 'items-baseline' },
    justify: { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' },
    wrap: { true: 'flex-wrap', false: 'flex-nowrap' },
    grow: { true: 'flex-1', false: '' },
  },
  defaultVariants: { direction: 'column', gap: 4, align: 'stretch', justify: 'start', wrap: false, grow: false },
})

/** Настройки раскладки блоков. */
export interface StackProps extends useRender.ComponentProps<'div'> {
  /** Блоки идут столбцом, строкой или столбцом на телефоне и строкой на широком экране. */
  direction?: VariantProps<typeof stackVariants>['direction']
  /** Расстояние между блоками из шкалы токенов. */
  gap?: VariantProps<typeof stackVariants>['gap']
  /** Выравнивание блоков поперёк направления. */
  align?: VariantProps<typeof stackVariants>['align']
  /** Распределение блоков вдоль направления. */
  justify?: VariantProps<typeof stackVariants>['justify']
  /** Блоки переносятся на новую строку, когда не помещаются. */
  wrap?: VariantProps<typeof stackVariants>['wrap']
  /** Блок занимает всё свободное место. */
  grow?: VariantProps<typeof stackVariants>['grow']
}

/** Раскладка блоков столбцом или строкой. Расстояния между блоками берутся из шкалы токенов. */
export function Stack({ render, className, direction, gap, align, justify, wrap, grow, ...props }: StackProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>({ className: cn(stackVariants({ direction, gap, align, justify, wrap, grow }), className) }, props),
  })
}
