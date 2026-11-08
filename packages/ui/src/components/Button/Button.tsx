import { Button as BaseButton } from '@base-ui/react/button'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '../../lib/cn/cn.ts'
import { Spinner } from '../Spinner/Spinner.tsx'

/** Варианты оформления кнопок и ссылок в виде кнопок. */
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
      },
      fullWidth: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', fullWidth: false },
  },
)

/** Настройки кнопки. */
export interface ButtonProps extends Omit<ComponentProps<typeof BaseButton>, 'className'> {
  /** Важность действия: главное, второстепенное, тихое или опасное. */
  variant?: VariantProps<typeof buttonVariants>['variant']
  /** Размер кнопки. Квадратная кнопка подходит для одного значка. */
  size?: VariantProps<typeof buttonVariants>['size']
  /** Кнопка занимает всю ширину блока. */
  fullWidth?: VariantProps<typeof buttonVariants>['fullWidth']
  /** Редкое исключение для раскладки на странице. */
  className?: string
  /** Действие выполняется: кнопка показывает индикатор и не принимает повторные нажатия. */
  loading?: boolean
}

/** Кнопка запускает действие на текущей странице. Для перехода на другую страницу используйте ссылку. */
export function Button({ variant, size, fullWidth, loading = false, disabled, className, children, type = 'button', ...props }: ButtonProps) {
  return (
    <BaseButton
      type={type}
      disabled={disabled === true || loading}
      focusableWhenDisabled={loading}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </BaseButton>
  )
}
