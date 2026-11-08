import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '../../lib/cn/cn.ts'

const containerVariants = cva('mx-auto w-full px-4 sm:px-6', {
  variants: {
    size: { sm: 'max-w-md', md: 'max-w-3xl', lg: 'max-w-5xl', xl: 'max-w-7xl' },
    padded: { true: 'py-8 sm:py-12', false: '' },
  },
  defaultVariants: { size: 'lg', padded: false },
})

export interface ContainerProps extends useRender.ComponentProps<'div'>, VariantProps<typeof containerVariants> {}

export function Container({ render, className, size, padded, ...props }: ContainerProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>({ className: cn(containerVariants({ size, padded }), className) }, props),
  })
}
