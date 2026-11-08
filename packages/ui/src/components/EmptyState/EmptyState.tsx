import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { Text } from '../Text/Text.tsx'

export interface EmptyStateProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 px-6 py-12 text-center', className)}>
      <Text weight="medium">{title}</Text>
      {description !== undefined && (
        <Text size="sm" tone="muted">
          {description}
        </Text>
      )}
      {action !== undefined && <div className="pt-2">{action}</div>}
    </div>
  )
}
