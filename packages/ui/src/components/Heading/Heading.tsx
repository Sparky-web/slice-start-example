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

export interface HeadingProps {
  /** Semantic level, also defines the visual size. */
  level: 1 | 2 | 3 | 4
  children: ReactNode
  className?: string
  id?: string
}

export function Heading({ level, children, className, id }: HeadingProps) {
  const Tag = `h${String(level)}` as 'h1' | 'h2' | 'h3' | 'h4'
  return (
    <Tag id={id} className={cn(headingVariants({ level }), className)}>
      {typeof children === 'string' ? typo(children) : children}
    </Tag>
  )
}
