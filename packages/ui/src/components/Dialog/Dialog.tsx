import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'

import { cn } from '../../lib/cn/cn.ts'

/** Настройки диалога. */
export interface DialogProps {
  /** Кнопка, которая открывает диалог. */
  trigger?: ReactElement
  /** Заголовок диалога. */
  title: ReactNode
  /** Пояснение под заголовком. */
  description?: ReactNode
  /** Содержимое диалога, обычно форма. */
  children: ReactNode
  /** Диалог открыт. Без этого свойства диалог сам следит за открытием. */
  open?: boolean
  /** Пользователь открыл или закрыл диалог. */
  onOpenChange?: (open: boolean) => void
  /** Ширина диалога. */
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' } as const

/** Диалог поверх страницы для короткой задачи: создать, изменить или подтвердить. */
export function Dialog({ trigger, title, description, children, open, onOpenChange, size = 'md' }: DialogProps) {
  return (
    <BaseDialog.Root
      {...(open === undefined ? {} : { open })}
      {...(onOpenChange === undefined
        ? {}
        : {
            onOpenChange: (next: boolean) => {
              onOpenChange(next)
            },
          })}
    >
      {trigger !== undefined && <BaseDialog.Trigger render={trigger} />}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-40 bg-foreground/40 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <BaseDialog.Popup
          className={cn(
            'fixed top-1/2 left-1/2 z-50 flex max-h-screen w-full -translate-1/2 flex-col gap-4 overflow-y-auto rounded-xl border bg-popover p-6 text-popover-foreground shadow-lg transition data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
            sizes[size],
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <BaseDialog.Title className="text-lg font-semibold">{title}</BaseDialog.Title>
              {description !== undefined && (
                <BaseDialog.Description className="text-sm text-muted-foreground">{description}</BaseDialog.Description>
              )}
            </div>
            <BaseDialog.Close
              aria-label="Закрыть"
              className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </BaseDialog.Close>
          </div>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
