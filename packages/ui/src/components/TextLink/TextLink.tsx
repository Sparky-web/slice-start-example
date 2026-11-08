import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'

import { cn } from '../../lib/cn/cn.ts'

/** Настройки ссылки в тексте. */
export interface TextLinkProps extends useRender.ComponentProps<'a'> {}

/** Ссылка внутри текста. Ссылку роутера передайте в свойство отрисовки. */
export function TextLink({ render, className, ...props }: TextLinkProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        className: cn(
          'font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-ring',
          className,
        ),
      },
      props,
    ),
  })
}
