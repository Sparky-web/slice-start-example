import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { typo } from '@repo/lib'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '../../lib/cn/cn.ts'

/** Варианты оформления текста из шкалы токенов. */
export const textVariants = cva('', {
  variants: {
    size: { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg' },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      success: 'text-success',
      inherit: '',
    },
    weight: { normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold' },
    truncate: { true: 'truncate', false: '' },
  },
  defaultVariants: { size: 'base', tone: 'default', weight: 'normal', truncate: false },
})

/** Настройки текстового блока. */
export interface TextProps extends useRender.ComponentProps<'p'> {
  /** Размер шрифта из шкалы токенов. */
  size?: VariantProps<typeof textVariants>['size']
  /** Смысловой цвет: основной, второстепенный, ошибка или успех. */
  tone?: VariantProps<typeof textVariants>['tone']
  /** Насыщенность шрифта. */
  weight?: VariantProps<typeof textVariants>['weight']
  /** Обрезает длинный текст многоточием в одну строку. */
  truncate?: VariantProps<typeof textVariants>['truncate']
}

/**
 * Основной текст интерфейса.
 * Короткие слова не отрываются от следующего слова при переносе строки.
 */
export function Text({ render, className, size, tone, weight, truncate, children, ...props }: TextProps) {
  return useRender({
    defaultTagName: 'p',
    render,
    props: mergeProps<'p'>(
      { className: cn(textVariants({ size, tone, weight, truncate }), className) },
      { ...props, children: typeof children === 'string' ? typo(children) : children },
    ),
  })
}
