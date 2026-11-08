import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { Text } from '../Text/Text.tsx'

/** Настройки пустого состояния. */
export interface EmptyStateProps {
  /** Что пусто, например «Задач нет». */
  title: ReactNode
  /** Что сделать дальше. */
  description?: ReactNode
  /** Кнопка или ссылка для следующего шага. */
  action?: ReactNode
  /** Редкое исключение для раскладки на странице. */
  className?: string
}

/** Пустое состояние: данных нет, и пользователь видит следующий шаг. */
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
