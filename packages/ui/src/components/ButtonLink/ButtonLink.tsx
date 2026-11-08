import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/cn/cn.ts'
import { buttonVariants } from '../Button/Button.tsx'

/** Настройки ссылки в виде кнопки. */
export interface ButtonLinkProps extends useRender.ComponentProps<'a'> {
  /** Важность перехода: главный, второстепенный или тихий. */
  variant?: VariantProps<typeof buttonVariants>['variant']
  /** Размер ссылки. */
  size?: VariantProps<typeof buttonVariants>['size']
  /** Ссылка занимает всю ширину блока. */
  fullWidth?: VariantProps<typeof buttonVariants>['fullWidth']
}

/** Ссылка выглядит как кнопка и ведёт на другую страницу. Ссылку роутера передайте в свойство отрисовки. */
export function ButtonLink({ render, className, variant, size, fullWidth, ...props }: ButtonLinkProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>({ className: cn(buttonVariants({ variant, size, fullWidth }), className) }, props),
  })
}
