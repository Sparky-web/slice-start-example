import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/cn/cn.ts'
import { buttonVariants } from '../Button/Button.tsx'

export interface ButtonLinkProps extends useRender.ComponentProps<'a'>, VariantProps<typeof buttonVariants> {}

/**
 * A link that looks like a button. Pass the router link via `render`:
 * `<ButtonLink render={<Link to="/projects" />}>Проекты</ButtonLink>`
 */
export function ButtonLink({ render, className, variant, size, fullWidth, ...props }: ButtonLinkProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>({ className: cn(buttonVariants({ variant, size, fullWidth }), className) }, props),
  })
}
