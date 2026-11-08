import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { Text } from '../Text/Text.tsx'

const alertVariants = cva('flex gap-3 rounded-lg border p-4', {
  variants: {
    tone: {
      info: 'border-info/30 bg-info/5 text-info',
      success: 'border-success/30 bg-success/5 text-success',
      destructive: 'border-destructive/30 bg-destructive/5 text-destructive',
    },
  },
  defaultVariants: { tone: 'info' },
})

const icons = { info: Info, success: CircleCheck, destructive: CircleAlert } as const

/** Настройки сообщения. */
export interface AlertProps {
  /** Смысл сообщения: сведения, успех или ошибка. */
  tone?: VariantProps<typeof alertVariants>['tone']
  /** Главная мысль сообщения. */
  title?: ReactNode
  /** Подробности и следующий шаг для пользователя. */
  children?: ReactNode
  /** Редкое исключение для раскладки на странице. */
  className?: string
}

/** Сообщение на странице: итог действия, ошибка или важные сведения. Экранный диктор озвучивает сообщение сразу. */
export function Alert({ tone, title, children, className }: AlertProps) {
  const Icon = icons[tone ?? 'info']
  return (
    <div role={tone === 'destructive' ? 'alert' : 'status'} className={cn(alertVariants({ tone }), className)}>
      <Icon className="mt-px size-4 shrink-0" />
      <div className="flex flex-col gap-1">
        {title !== undefined && (
          <Text size="sm" weight="medium" tone="inherit">
            {title}
          </Text>
        )}
        {children !== undefined && (
          <Text size="sm" tone="inherit" render={<div />}>
            {children}
          </Text>
        )}
      </div>
    </div>
  )
}
