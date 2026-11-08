import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full border px-2 text-xs font-medium whitespace-nowrap', {
  variants: {
    tone: {
      neutral: 'border-transparent bg-secondary text-secondary-foreground',
      info: 'border-info/30 bg-info/10 text-info',
      success: 'border-success/30 bg-success/10 text-success',
      warning: 'border-warning/40 bg-warning/15 text-foreground',
      destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
      outline: 'text-foreground',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode
  className?: string
}

export function Badge({ tone, children, className }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>
}
