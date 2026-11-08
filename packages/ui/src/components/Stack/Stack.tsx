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

export interface StackProps extends useRender.ComponentProps<'div'>, VariantProps<typeof stackVariants> {}

/** Flex layout primitive: all spacing between blocks comes from the token scale. */
export function Stack({ render, className, direction, gap, align, justify, wrap, grow, ...props }: StackProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>({ className: cn(stackVariants({ direction, gap, align, justify, wrap, grow }), className) }, props),
  })
}
