import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { typo } from '@repo/lib'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '../../lib/cn/cn.ts'

export const textVariants = cva('', {
  variants: {
    size: { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg' },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      success: 'text-success',
      inherit: '',
    },
    weight: { normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold' },
    truncate: { true: 'truncate', false: '' },
  },
  defaultVariants: { size: 'base', tone: 'default', weight: 'normal', truncate: false },
})

export interface TextProps extends useRender.ComponentProps<'p'>, VariantProps<typeof textVariants> {}

/**
 * Body text. String children get Russian typography at runtime,
 * static JSX text is processed at build time by `typoPlugin`.
 */
export function Text({ render, className, size, tone, weight, truncate, children, ...props }: TextProps) {
  return useRender({
    defaultTagName: 'p',
    render,
    props: mergeProps<'p'>(
      { className: cn(textVariants({ size, tone, weight, truncate }), className) },
      { ...props, children: typeof children === 'string' ? typo(children) : children },
    ),
  })
}
