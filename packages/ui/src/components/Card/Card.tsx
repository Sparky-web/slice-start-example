import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { Heading } from '../Heading/Heading.tsx'
import { Text } from '../Text/Text.tsx'

export interface CardProps {
  title?: ReactNode
  description?: ReactNode
  /** Buttons or links in the card header. */
  actions?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
}

export function Card({ title, description, actions, footer, children, className }: CardProps) {
  const hasHeader = title !== undefined || description !== undefined || actions !== undefined
  return (
    <section className={cn('flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm', className)}>
      {hasHeader && (
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            {title !== undefined && <Heading level={3}>{title}</Heading>}
            {description !== undefined && (
              <Text size="sm" tone="muted">
                {description}
              </Text>
            )}
          </div>
          {actions !== undefined && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
      {footer !== undefined && <footer className="flex items-center justify-end gap-2 border-t pt-4">{footer}</footer>}
    </section>
  )
}
