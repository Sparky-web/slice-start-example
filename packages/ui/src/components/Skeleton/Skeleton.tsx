import { cn } from '../../lib/cn/cn.ts'

/** Настройки заглушки. */
export interface SkeletonProps {
  /** Размер заглушки под форму будущего контента. */
  className?: string
}

/** Заглушка на месте контента, который ещё загружается. Страница не прыгает после загрузки. */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden className={cn('h-4 w-full animate-pulse rounded-md bg-muted', className)} />
}
